import { mutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getUserByClerkId } from "./_utils";

// Create a new friend request
export const create = mutation({
  args: {
    email: v.string(), // receiver's email
  },
  async handler(ctx, args) {
    const senderIdentity = await ctx.auth.getUserIdentity();

    if (!senderIdentity) {
      throw new ConvexError("You need to be logged in to send a request.");
    }

    if (senderIdentity.email === args.email) {
      throw new ConvexError("You can't send a request to yourself!");
    }

    const currentUser = await getUserByClerkId(ctx, senderIdentity.subject);

    if (!currentUser) {
      throw new ConvexError(
        "We couldn't find your user account! Please try again."
      );
    }

    const receiver = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (!receiver) {
      throw new ConvexError(
        "No user found with that email address! Please check and try again."
      );
    }

    const requestAlreadySent = await ctx.db
      .query("requests")
      .withIndex("by_receiver_sender", (q) =>
        q.eq("receiver", receiver._id).eq("sender", currentUser._id)
      )
      .unique();

    if (requestAlreadySent) {
      throw new ConvexError(
        "Looks like you've already sent a request to this user."
      );
    }

    const requestAlreadyReceived = await ctx.db
      .query("requests")
      .withIndex("by_receiver_sender", (q) =>
        q.eq("receiver", currentUser._id).eq("sender", receiver._id)
      )
      .unique();

    if (requestAlreadyReceived) {
      throw new ConvexError(
        "This user has already sent you a request. Check your pending requests!"
      );
    }

    return await ctx.db.insert("requests", {
      sender: currentUser._id,
      receiver: receiver._id,
    });
  },
});

// Reject a friend request
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
