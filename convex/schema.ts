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
  // chats table
  chats: defineTable({
    name: v.optional(v.string()),
    isGroup: v.boolean(),
    lastMessageId: v.optional(v.id("messages")),
  }),
  // friends table
  friends: defineTable({
    user1: v.id("users"),
    user2: v.id("users"),
    chatId: v.id("chats"),
  })
    .index("by_user1", ["user1"])
    .index("by_user2", ["user2"])
    .index("by_chatId", ["chatId"]),
  // messages table
  messages: defineTable({
    senderId: v.id("users"),
    type: v.string(),
    content: v.array(v.string()),
    chatId: v.id("chats"),
  }).index("by_chatId", ["chatId"]),
  // chat members table
  chatMembers: defineTable({
    memberId: v.id("users"),
    chatId: v.id("chats"),
    lastSeenMessage: v.optional(v.id("messages")),
  })
    .index("by_memberId", ["memberId"])
    .index("by_chatId", ["chatId"])
    .index("by_memberId_chatId", ["memberId", "chatId"]),
});
