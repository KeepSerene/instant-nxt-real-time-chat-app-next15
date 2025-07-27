import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getUserByClerkId } from "./_utils";

// Fetch details of a single chat by ID, including permission check and participant info
export const get = query({
  args: {
    id: v.id("chats"), // ID of the chat document to retrieve
  },
  async handler(ctx, args) {
    // 1) Ensure the request comes from an authenticated user
    const userIdentity = await ctx.auth.getUserIdentity();

    if (!userIdentity) {
      throw new ConvexError("You must be signed in to view chat details.");
    }

    // 2) Load the current user's profile record
    const currentUser = await getUserByClerkId(ctx, userIdentity.subject);

    if (!currentUser) {
      throw new ConvexError(
        "Your account could not be found. Please sign in again."
      );
    }

    // 3) Retrieve the chat document by its ID
    const chatRecord = await ctx.db.get(args.id);

    if (!chatRecord) {
      throw new ConvexError(`Chat with ID ${args.id} was not found!`);
    }

    // 4) Verify the current user is a member of this chat
    const membershipRecord = await ctx.db
      .query("chatMembers")
      .withIndex("by_memberId_chatId", (q) =>
        q.eq("memberId", currentUser._id).eq("chatId", chatRecord._id)
      )
      .unique();

    if (!membershipRecord) {
      throw new ConvexError("You are not a member of this chat!");
    }

    // 5) Fetch all membership records for this chat
    const chatMemberRecords = await ctx.db
      .query("chatMembers")
      .withIndex("by_chatId", (q) => q.eq("chatId", chatRecord._id))
      .collect();

    // 6) If this is a one-on-one chat, identify and load the "other" user details
    if (!chatRecord.isGroup) {
      // Find the membership record for the other participant
      const otherMemberRecord = chatMemberRecords.find(
        (m) => m.memberId !== currentUser._id
      );

      if (!otherMemberRecord) {
        throw new ConvexError(
          `No other participant found in chat ${chatRecord._id}!`
        );
      }

      // Load the other user's profile
      const otherUserProfile = await ctx.db.get(otherMemberRecord.memberId);

      if (!otherUserProfile) {
        throw new ConvexError(
          `User not found (ID: ${otherMemberRecord.memberId}).`
        );
      }

      // Return chat fields plus other user info and their last seen message ID
      return {
        ...chatRecord,
        otherMember: {
          ...otherUserProfile,
          lastSeenMessageId: otherMemberRecord.lastSeenMessage,
        },
        // For one-on-one chat, no array of multiple others
        otherMembers: null,
      };
    }

    // 7) Group chat: return chat info plus member list (excluding sensitive data as needed)
    // Optionally, we can fetch profiles of all members
    const otherProfiles = await Promise.all(
      chatMemberRecords
        // Exclude current user if desired; here returning all other members
        .filter((m) => m.memberId !== currentUser._id)
        .map(async (m) => {
          const profile = await ctx.db.get(m.memberId);

          if (!profile) {
            throw new ConvexError(`Member user not found (ID: ${m.memberId})!`);
          }
          return {
            ...profile,
            lastSeenMessageId: m.lastSeenMessage,
          };
        })
    );

    // Return the group chat record plus array of other members' profiles
    return {
      ...chatRecord,
      otherMember: null, // not applicable for group chat
      otherMembers: otherProfiles,
    };
  },
});

export const createGroup = mutation({
  args: {
    members: v.array(v.id("users")),
    name: v.string(),
  },
  async handler(ctx, args) {
    const userIdentity = await ctx.auth.getUserIdentity();

    if (!userIdentity) {
      throw new ConvexError("You must be signed in to view your chats!");
    }

    const me = await getUserByClerkId(ctx, userIdentity.subject);

    if (!me) {
      throw new ConvexError(
        "Your user account could not be found! Please try signing in again."
      );
    }

    const chatId = await ctx.db.insert("chats", {
      isGroup: true,
      name: args.name,
    });

    await Promise.all(
      [...args.members, me._id].map(async (memberId) => {
        await ctx.db.insert("chatMembers", {
          memberId,
          chatId,
        });
      })
    );
  },
});

/**
 * Mutation to delete a group chat and all related records:
 * - Ensures the user is authenticated.
 * - Verifies the user exists in our database.
 * - Confirms the chat and its memberships.
 * - Removes the chat, memberships, and messages.
 */
export const deleteGroup = mutation({
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

    // 3️. Fetch the group chat by ID
    const groupChatRecord = await ctx.db.get(chatId);
    if (!groupChatRecord) {
      throw new ConvexError("Chat not found: invalid chat ID!");
    }

    // 4️. Retrieve all members of this group chat
    const members = await ctx.db
      .query("chatMembers")
      .withIndex("by_chatId", (q) => q.eq("chatId", chatId))
      .collect();
    if (members.length <= 1) {
      throw new ConvexError(
        "Insufficient members in this group chat: deletion aborted!"
      );
    }

    // 5. Collect all messages in this group chat
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chatId", (q) => q.eq("chatId", chatId))
      .collect();

    // 6. Delete the group chat record
    await ctx.db.delete(chatId);

    // 7. Remove each group chat membership record
    for (const member of members) {
      await ctx.db.delete(member._id);
    }

    // 8. Remove all messages in the group chat
    for (const msg of messages) {
      await ctx.db.delete(msg._id);
    }
  },
});

/**
 * Mutation that allows the current authenticated user to leave a group chat.
 */
export const leaveGroup = mutation({
  // Define expected arguments: a single chat ID of type 'chats'.
  args: {
    chatId: v.id("chats"),
  },
  async handler(ctx, { chatId }) {
    // 1️. Ensure the user is authenticated.
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new ConvexError(
        "Authentication required: please sign in to manage your chats!"
      );
    }

    // 2️. Fetch the current user record based on their Clerk ID.
    const currentUser = await getUserByClerkId(ctx, userIdentity.subject);
    if (!currentUser) {
      throw new ConvexError(
        "User not found: please reauthenticate or contact support!"
      );
    }

    // 3️. Verify the chat exists.
    const groupChatRecord = await ctx.db.get(chatId);
    if (!groupChatRecord) {
      throw new ConvexError("Chat not found: invalid chat ID!");
    }

    // 4️. Check that the user is actually a member of this chat.
    //    We look up the chatMembers table where memberId and chatId match.
    const member = await ctx.db
      .query("chatMembers")
      .withIndex("by_memberId_chatId", (q) =>
        q.eq("memberId", currentUser._id).eq("chatId", chatId)
      )
      .unique();
    if (!member) {
      throw new ConvexError("You're not a member of this group chat!");
    }

    // 5️. Delete the membership record, effectively leaving the group.
    await ctx.db.delete(member._id);
  },
});

/**
 * Mutation to mark a specific message as read by the current user in a chat.
 */
export const markRead = mutation({
  // Define expected arguments: chat ID and message ID.
  args: {
    chatId: v.id("chats"),
    messageId: v.id("messages"),
  },
  async handler(ctx, { chatId, messageId }) {
    // 1️. Ensure the user is authenticated.
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new ConvexError(
        "Authentication required: please sign in to manage your chats!"
      );
    }

    // 2️. Fetch the current user record based on their Clerk ID.
    const currentUser = await getUserByClerkId(ctx, userIdentity.subject);
    if (!currentUser) {
      throw new ConvexError(
        "User not found: please reauthenticate or contact support!"
      );
    }

    // 3️. Confirm the user is a member of the specified chat.
    //    We query the chatMembers table by memberId and chatId.
    const membership = await ctx.db
      .query("chatMembers")
      .withIndex("by_memberId_chatId", (q) =>
        q.eq("memberId", currentUser._id).eq("chatId", chatId)
      )
      .unique();
    if (!membership) {
      throw new ConvexError(
        "Permission denied: you are not part of this chat."
      );
    }

    // 4️. Fetch the target message to ensure it exists.
    const messageRecord = await ctx.db.get(messageId);
    if (!messageRecord) {
      throw new ConvexError("Message not found: invalid message ID.");
    }

    // 5️. Update the member's lastSeenMessage field to this message.
    //    This marks all messages up to this one as read for this user.
    await ctx.db.patch(membership._id, {
      lastSeenMessage: messageRecord._id,
    });
  },
});
