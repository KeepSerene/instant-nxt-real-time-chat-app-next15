import { mutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getUserByClerkId } from "./_utils";

// Create a new request
export const create = mutation({
  args: {
    email: v.string(), // receiver's email
  },
  async handler(ctx, args) {
    const senderIdentity = await ctx.auth.getUserIdentity();

    if (!senderIdentity) {
      throw new ConvexError("Unauthorized sender!");
    }

    if (senderIdentity.email === args.email) {
      throw new ConvexError("Cannot send a request to yourself!");
    }

    const currentUser = await getUserByClerkId(ctx, senderIdentity.subject);

    if (!currentUser) {
      throw new ConvexError("User (sender) not found!");
    }

    const receiver = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (!receiver) {
      throw new ConvexError("User (receiver) not found!");
    }

    const requestAlreadySent = ctx.db
      .query("requests")
      .withIndex("by_receiver_sender", (q) =>
        q.eq("receiver", receiver._id).eq("sender", currentUser._id)
      );

    if (requestAlreadySent) {
      throw new ConvexError("Request already sent!");
    }

    const requestAlreadyReceived = ctx.db
      .query("requests")
      .withIndex("by_receiver_sender", (q) =>
        q.eq("receiver", currentUser._id).eq("sender", receiver._id)
      );

    if (requestAlreadyReceived) {
      throw new ConvexError("Request already received!");
    }

    return await ctx.db.insert("requests", {
      sender: currentUser._id,
      receiver: receiver._id,
    });
  },
});
