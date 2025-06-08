import { mutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getUserByClerkId } from "./_utils";

// Create a new friend request by email
export const create = mutation({
  args: {
    email: v.string(), // The receiver's email address
  },
  async handler(ctx, args) {
    // 1) Ensure the user is logged in
    const senderIdentity = await ctx.auth.getUserIdentity();

    if (!senderIdentity) {
      throw new ConvexError("You need to be logged in to send a request.");
    }

    // 2) Prevent sending a request to yourself
    if (senderIdentity.email === args.email) {
      throw new ConvexError("You can't send a request to yourself!");
    }

    // 3) Look up the “current user” record by Clerk ID
    const currentUser = await getUserByClerkId(ctx, senderIdentity.subject);

    if (!currentUser) {
      throw new ConvexError(
        "We couldn't find your user account! Please try again."
      );
    }

    // 4) Find the “receiver” by email
    const receiver = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (!receiver) {
      throw new ConvexError(
        "No user found with that email address! Please check and try again."
      );
    }

    // 5) Don’t duplicate an outgoing request
    const outgoingRequest = await ctx.db
      .query("requests")
      .withIndex("by_receiver_sender", (q) =>
        q.eq("receiver", receiver._id).eq("sender", currentUser._id)
      )
      .unique();

    if (outgoingRequest) {
      throw new ConvexError(
        "Looks like you've already sent a request to this user."
      );
    }

    // 6) Don’t duplicate an incoming (reverse) request
    const incomingRequest = await ctx.db
      .query("requests")
      .withIndex("by_receiver_sender", (q) =>
        q.eq("receiver", currentUser._id).eq("sender", receiver._id)
      )
      .unique();

    if (incomingRequest) {
      throw new ConvexError(
        "This user has already sent you a request. Check your pending requests!"
      );
    }

    // 7) Prevent “friending” someone you’re already friends with
    const friendsOfYou = await ctx.db
      .query("friends")
      .withIndex("by_userId", (q) => q.eq("userId", currentUser._id))
      .collect();

    const friendsOfThem = await ctx.db
      .query("friends")
      .withIndex("by_friendId", (q) => q.eq("friendId", currentUser._id))
      .collect();

    if (
      friendsOfYou.some((friend) => friend.userId === receiver._id) ||
      friendsOfThem.some((friend) => friend.friendId === receiver._id)
    ) {
      throw new ConvexError("You are already friends with this user!");
    }

    // 8) All checks passed -> create the friend request
    return await ctx.db.insert("requests", {
      sender: currentUser._id,
      receiver: receiver._id,
    });
  },
});

// Reject a friend request by its document ID
export const reject = mutation({
  args: {
    id: v.id("requests"),
  },
  async handler(ctx, args) {
    // 1) Check that the user is logged in:
    const senderIdentity = await ctx.auth.getUserIdentity();

    if (!senderIdentity) {
      throw new ConvexError(
        "You must be logged in to reject a friend request!"
      );
    }

    // 2) Fetch the “currentUser” record based on Clerk ID:
    const currentUser = await getUserByClerkId(ctx, senderIdentity.subject);

    if (!currentUser) {
      throw new ConvexError(
        "Your user account could not be found. Please refresh or contact support."
      );
    }

    // 3) Look up the friend request by ID:
    const friendRequest = await ctx.db.get(args.id);

    if (!friendRequest) {
      throw new ConvexError(
        `Friend request not found (ID: ${args.id})! It may have already been processed or never existed.`
      );
    }

    // 4) Make sure the current user is actually the “receiver”:
    if (friendRequest.receiver.toString() !== currentUser._id.toString()) {
      throw new ConvexError("You are not authorized to reject this request.");
    }

    // 5) All checks passed -> delete the request:
    await ctx.db.delete(friendRequest._id);
  },
});

// Accept a pending friend request by its document ID
export const accept = mutation({
  args: {
    id: v.id("requests"), // the ID of the friend‐request document
  },
  async handler(ctx, args) {
    // 1) Ensure user is authenticated
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new ConvexError(
        "You must be logged in to accept a friend request!"
      );
    }

    // 2) Load the current user record from 'users' table
    const currentUser = await getUserByClerkId(ctx, userIdentity.subject);
    if (!currentUser) {
      throw new ConvexError(
        "Your account could not be found! Please refresh the page or contact support."
      );
    }

    // 3) Fetch the friend-request document
    const friendRequest = await ctx.db.get(args.id);

    if (!friendRequest) {
      throw new ConvexError(
        `Friend request with ID ${args.id} not found! It may have already been handled.`
      );
    }

    // 4) Ensure this user is the intended receiver
    if (friendRequest.receiver !== currentUser._id) {
      throw new ConvexError(
        "You are not authorized to accept this friend request!"
      );
    }

    // 5) Create a new chat for this friendship
    const chatId = await ctx.db.insert("chats", {
      isGroup: false,
      // `name` and `lastMessageId` remain unset for one-on-one chats
    });

    // 6) Insert friendship links (user → friend)
    await ctx.db.insert("friends", {
      userId: currentUser._id,
      friendId: friendRequest.sender,
      chatId,
    });

    // 7) Add both participants as chat members
    await ctx.db.insert("chatMembers", {
      memberId: currentUser._id,
      chatId,
      // `lastSeenMessage` remains unset until they read something
    });
    await ctx.db.insert("chatMembers", {
      memberId: friendRequest.sender,
      chatId,
    });

    // 8) Delete the original friend request
    await ctx.db.delete(friendRequest._id);
  },
});
