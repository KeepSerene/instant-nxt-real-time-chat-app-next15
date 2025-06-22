import { mutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getUserByClerkId } from "./_utils";

export const create = mutation({
  args: {
    // ID of the chat in which to insert the new message
    chatId: v.id("chats"),
    // Type of message (e.g., "text", "image", etc.)
    type: v.string(),
    // Content array: for example, array of text lines or parts
    content: v.array(v.string()),
  },
  async handler(ctx, args) {
    // 1. Ensure user is authenticated
    const userIdentity = await ctx.auth.getUserIdentity();

    if (!userIdentity) {
      throw new ConvexError(
        "Please sign in to send messages. If you don't have an account yet, please create one!"
      );
    }

    // 2. Fetch current user record from database via the Clerk ID
    const currentUser = await getUserByClerkId(ctx, userIdentity.subject);

    if (!currentUser) {
      // This is unlikely if auth and user creation flow is correct, but handle gracefully
      throw new ConvexError(
        "We couldn't find your user account! Please try signing in again or contact support if the issue persists."
      );
    }

    // 3. Verify that this user is indeed a member of the chat
    const membership = await ctx.db
      .query("chatMembers")
      .withIndex("by_memberId_chatId", (q) =>
        q.eq("memberId", currentUser._id).eq("chatId", args.chatId)
      )
      .unique();

    if (!membership) {
      // User is not part of this chat – deny posting
      throw new ConvexError(
        "You're not a member of this chat, so you cannot post messages here! Please join the chat or request access."
      );
    }

    // 4. Insert the new message into the "messages" table
    // We store senderId plus the args: chatId, type, content
    const msgId = await ctx.db.insert("messages", {
      senderId: currentUser._id,
      chatId: args.chatId,
      type: args.type,
      content: args.content,
    });

    // 5. Update the chat record’s lastMessageId so you can quickly access latest message
    await ctx.db.patch(args.chatId, {
      lastMessageId: msgId,
    });

    // 6. Return the new message ID back to the frontend
    return msgId;
  },
});
