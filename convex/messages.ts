import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

/**
 * Query to fetch messages for a given chat.
 * Ensures the requester is authenticated and a member of the chat,
 * then returns messages along with sender metadata.
 */
export const get = query({
  args: {
    chatId: v.id("chats"),
  },
  async handler(ctx, { chatId }) {
    // Retrieve authenticated user identity
    const userIdentity = await ctx.auth.getUserIdentity();

    if (!userIdentity) {
      throw new ConvexError(
        "Authentication required: please sign in to view messages."
      );
    }

    // Find the current user in our database by their Clerk ID
    const currentUser = await getUserByClerkId(ctx, userIdentity.subject);

    if (!currentUser) {
      throw new ConvexError(
        "User not found: please reauthenticate or contact support."
      );
    }

    // Verify that the user is a member of the requested chat
    const chatMembership = await ctx.db
      .query("chatMembers")
      .withIndex("by_memberId_chatId", (q) =>
        q.eq("memberId", currentUser._id).eq("chatId", chatId)
      )
      .unique();

    if (!chatMembership) {
      throw new ConvexError(
        "Access denied: you are not a member of this chat."
      );
    }

    // Fetch messages for the chat in descending order (newest first)
    const chatMessages = await ctx.db
      .query("messages")
      .withIndex("by_chatId", (q) => q.eq("chatId", chatId))
      .order("desc")
      .collect();

    // Enrich each message with sender details
    const chatMessagesWithUsers = await Promise.all(
      chatMessages.map(async (msg) => {
        const sender = await ctx.db.get(msg.senderId);

        if (!sender) {
          throw new ConvexError(
            `Sender not found for message ${msg._id.toString()}.`
          );
        }

        return {
          msg,
          senderAvatar: sender.avatarUrl,
          senderName: sender.username,
          isCurrentUser: sender._id === currentUser._id,
        };
      })
    );

    return chatMessagesWithUsers;
  },
});
