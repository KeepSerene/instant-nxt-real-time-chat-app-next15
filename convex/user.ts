import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

// Create a new user
export const create = internalMutation({
  args: {
    clerkId: v.string(),
    username: v.string(),
    avatarUrl: v.string(),
    email: v.string(),
  },
  async handler(ctx, args) {
    await ctx.db.insert("users", args);
  },
});

// Get a unique user by their Clerk ID
export const get = internalQuery({
  args: {
    clerkId: v.string(),
  },
  async handler(ctx, args) {
    await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();
  },
});
