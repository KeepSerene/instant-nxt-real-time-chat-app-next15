import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // users table
  users: defineTable({
    clerkId: v.string(),
    username: v.string(),
    avatarUrl: v.string(),
    email: v.string(),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_email", ["email"]),
  // friend requests table
  requests: defineTable({
    sender: v.id("users"),
    receiver: v.id("users"),
  })
    .index("by_receiver", ["receiver"])
    .index("by_receiver_sender", ["receiver", "sender"]),
  // friends table
  friends: defineTable({
    user1: v.id("users"),
    user2: v.id("users"),
    chatId: v.id("chats"),
  })
    .index("by_user1", ["user1"])
    .index("by_user2", ["user2"])
    .index("by_chatId", ["chatId"]),
});
