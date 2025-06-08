import { ConvexError } from "convex/values";
import { query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

// Retrieve all chats (and basic participant info) for the current user
export const get = query({
  args: {}, // no arguments needed — uses the authenticated user
  async handler(ctx, _args) {
    // 1) Ensure the user is signed in
    const userIdentity = await ctx.auth.getUserIdentity();

    if (!userIdentity) {
      throw new ConvexError("You must be signed in to view your chats!");
    }

    // 2) Load the current user record
    const me = await getUserByClerkId(ctx, userIdentity.subject);

    if (!me) {
      throw new ConvexError(
        "Your user account could not be found! Please try signing in again."
      );
    }

    // 3) Fetch all chat‐membership records for this user
    const myMemberships = await ctx.db
      .query("chatMembers")
      .withIndex("by_memberId", (q) => q.eq("memberId", me._id))
      .collect();

    // 4) Load each chat document in parallel
    const chats = await Promise.all(
      myMemberships.map(async (membership) => {
        const chat = await ctx.db.get(membership.chatId);

        if (!chat) {
          throw new ConvexError(`Chat not found (ID: ${membership.chatId})!`);
        }
        return chat;
      })
    );

    // 5) For each chat, if it's one‐on‐one, also load the “other” user
    const enrichedChats = await Promise.all(
      chats.map(async (chat) => {
        // Fetch all memberships for this chat
        const membershipsForChat = await ctx.db
          .query("chatMembers")
          .withIndex("by_chatId", (q) => q.eq("chatId", chat._id))
          .collect();

        if (chat.isGroup) {
          // Group chat: no single “other” member
          return { chat };
        }

        // One‐on‐one chat: find the membership that isn't the current user
        const otherMembership = membershipsForChat.find(
          (m) => m.memberId !== me._id
        );

        if (!otherMembership) {
          throw new ConvexError(
            `No other participant found in chat ${chat._id}!`
          );
        }

        // Load the other user's profile
        const otherUser = await ctx.db.get(otherMembership.memberId);

        if (!otherUser) {
          throw new ConvexError(
            `User not found (ID: ${otherMembership.memberId})!`
          );
        }

        return { chat, otherUser };
      })
    );

    // 6) Return the array of chat records (with optional `otherUser` for DMs)
    return enrichedChats;
  },
});
