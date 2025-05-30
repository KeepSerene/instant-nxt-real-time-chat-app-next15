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
