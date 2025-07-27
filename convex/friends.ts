import { ConvexError } from "convex/values";
import { query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

/**
 * Query to retrieve the list of friends (contacts) for the current authenticated user.
 */
export const getFriends = query({
  args: {}, // No arguments required; uses the authenticated user.
  async handler(ctx, _args) {
    // 1) Authentication: ensure user is signed in.
    const userIdentity = await ctx.auth.getUserIdentity();

    if (!userIdentity) {
      throw new ConvexError("You must be signed in to view your friends!");
    }

    // 2) Fetch the current user's record using their Clerk ID.
    const currentUser = await getUserByClerkId(ctx, userIdentity.subject);

    if (!currentUser) {
      throw new ConvexError("User account not found! Please sign in again.");
    }

    // 3) Query the friends table for outgoing and incoming friendships.
    const outgoingFriendships = await ctx.db
      .query("friends")
      .withIndex("by_userId", (q) => q.eq("userId", currentUser._id))
      .collect();
    const incomingFriendships = await ctx.db
      .query("friends")
      .withIndex("by_friendId", (q) => q.eq("friendId", currentUser._id))
      .collect();

    // Combine both sets of friendship records.
    const allFriendships = [...outgoingFriendships, ...incomingFriendships];

    // 4) Resolve each friendship to the corresponding user document.
    const friendsList = await Promise.all(
      allFriendships.map(async (friendship) => {
        // Determine the friend’s user ID (the other party).
        const friendId =
          friendship.userId === currentUser._id
            ? friendship.friendId
            : friendship.userId;
        const friendUser = await ctx.db.get(friendId);

        if (!friendUser) {
          throw new ConvexError("Friend could not be found!");
        }
        return friendUser;
      })
    );

    return friendsList;
  },
});
