import { query } from "./_generated/server";
import { ConvexError } from "convex/values";
import { getUserByClerkId } from "./_utils";

// Fetch all incoming friend requests for the current user
export const get = query({
  args: {},
  async handler(ctx, args) {
    // Ensure the user is authenticated
    const senderIdentity = await ctx.auth.getUserIdentity();

    if (!senderIdentity) {
      throw new ConvexError("Please sign in to view your friend requests.");
    }

    // Look up the current user record
    const currentUser = await getUserByClerkId(ctx, senderIdentity.subject);
    if (!currentUser) {
      throw new ConvexError("We couldn't find your account! Please try again.");
    }

    // Query for requests where the current user is the receiver
    const requests = await ctx.db
      .query("requests")
      .withIndex("by_receiver", (q) => q.eq("receiver", currentUser._id))
      .collect();

    // Attach sender user info to each request
    const incomingRequests = await Promise.all(
      requests.map(async (request) => {
        const senderUser = await ctx.db.get(request.sender);

        if (!senderUser) {
          throw new ConvexError(
            "Could not find the user who sent this friend request."
          );
        }
        return { senderUser, request };
      })
    );

    return incomingRequests;
  },
});

// Fetch the request count
export const count = query({
  args: {},
  async handler(ctx, args) {},
});
