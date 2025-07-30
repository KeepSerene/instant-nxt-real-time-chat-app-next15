import { ConvexError } from "convex/values";
import { MutationCtx, query, QueryCtx } from "./_generated/server";
import { getUserByClerkId } from "./_utils";
import { Id } from "./_generated/dataModel";

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

    // 5) For each chat, if it's one‐on‐one, also load the "other" user
    const enrichedChats = await Promise.all(
      chats.map(async (chat) => {
        // Fetch all memberships for this chat
        const membershipsForChat = await ctx.db
          .query("chatMembers")
          .withIndex("by_chatId", (q) => q.eq("chatId", chat._id))
          .collect();

        const lastMsg = await getLastMsgDetails({
          ctx,
          msgId: chat.lastMessageId,
        });

        // Find the current user's membership record for this chat
        const myMembershipForChat = membershipsForChat.find(
          (m) => m.memberId === me._id
        );

        if (!myMembershipForChat) {
          throw new ConvexError(
            `User membership not found for chat ${chat._id}!`
          );
        }

        const lastSeenMsg = myMembershipForChat.lastSeenMessage
          ? await ctx.db.get(myMembershipForChat.lastSeenMessage)
          : null;

        const lastSeenMsgCreationTime = lastSeenMsg
          ? lastSeenMsg._creationTime
          : -1;

        const unreadMsgs = await ctx.db
          .query("messages")
          .withIndex("by_chatId", (q) => q.eq("chatId", chat._id))
          .filter((q) =>
            q.gt(q.field("_creationTime"), lastSeenMsgCreationTime)
          )
          .filter((q) => q.neq(q.field("senderId"), me._id))
          .collect();

        if (chat.isGroup) {
          // Group chat: no single "other" member
          return { chat, lastMsg, unreadMsgCount: unreadMsgs.length };
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

        return { chat, otherUser, lastMsg, unreadMsgCount: unreadMsgs.length };
      })
    );

    // 6) Return the array of chat records (with optional `otherUser` for DMs)
    return enrichedChats;
  },
});

const getMsgContent = (msgType: string, rawContent: string) => {
  switch (msgType) {
    case "text":
      return rawContent;
    default:
      return "[Non-Text]";
  }
};

const getLastMsgDetails = async ({
  ctx,
  msgId,
}: {
  ctx: QueryCtx | MutationCtx;
  msgId: Id<"messages"> | undefined;
}) => {
  if (!msgId) {
    return null;
  }

  const msg = await ctx.db.get(msgId);

  if (!msg) return null;

  const sender = await ctx.db.get(msg.senderId);

  if (!sender) return null;

  const content = getMsgContent(msg.type, msg.content as unknown as string);

  return {
    content,
    senderName: sender.username,
  };
};
