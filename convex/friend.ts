import { mutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getUserByClerkId } from "./_utils";

/**
 * Mutation to delete a one-on-one chat and all related records:
 * - Ensures the user is authenticated.
 * - Verifies the user exists in our database.
 * - Confirms the chat and its memberships.
 * - Removes the chat, friendship record, memberships, and messages.
 */
export const deleteChat = mutation({
  args: {
    chatId: v.id("chats"),
  },
  async handler(ctx, { chatId }) {
    // 1️. Authentication check
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new ConvexError(
        "Authentication required: please sign in to manage your chats!"
      );
    }

    // 2️. Lookup current user by their Clerk ID
    const currentUser = await getUserByClerkId(ctx, userIdentity.subject);
    if (!currentUser) {
      throw new ConvexError(
        "User not found: please reauthenticate or contact support!"
      );
    }

    // 3️. Fetch the chat by ID
    const chatRecord = await ctx.db.get(chatId);
    if (!chatRecord) {
      throw new ConvexError("Chat not found: invalid chat ID!");
    }

    // 4️. Retrieve all members of this chat
    const members = await ctx.db
      .query("chatMembers")
      .withIndex("by_chatId", (q) => q.eq("chatId", chatId))
      .collect();
    if (members.length === 0) {
      throw new ConvexError(
        "No members found for this chat: deletion aborted!"
      );
    }

    // 5️. Ensure there is an associated friendship record
    const chatFriend = await ctx.db
      .query("friends")
      .withIndex("by_chatId", (q) => q.eq("chatId", chatId))
      .unique();
    if (!chatFriend) {
      throw new ConvexError("Friendship record missing: cannot delete chat!");
    }

    // 6️. Collect all messages in this chat
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chatId", (q) => q.eq("chatId", chatId))
      .collect();

    // 7️. Delete the chat record
    await ctx.db.delete(chatId);

    // 8️. Delete the friendship record linking the two users
    await ctx.db.delete(chatFriend._id);

    // 9️. Remove each chat membership record
    for (const member of members) {
      await ctx.db.delete(member._id);
    }

    // 10. Remove all messages in the chat
    for (const msg of messages) {
      await ctx.db.delete(msg._id);
    }
  },
});
