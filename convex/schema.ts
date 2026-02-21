import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    image: v.string(),
    isOnline: v.optional(v.boolean()),
    lastSeen: v.optional(v.number()),
  }).index("by_clerkId", ["clerkId"]),

  conversations: defineTable({
    participants: v.array(v.string()), // clerkIds
    lastMessage: v.optional(v.string()),
    lastMessageTime: v.optional(v.number()),
    isGroup: v.optional(v.boolean()),
    groupName: v.optional(v.string()),
    lastMessageReactions: v.optional(v.string()),
  }).index("by_participants", ["participants"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.string(), // clerkId
    text: v.string(),
    createdAt: v.number(),
    isRead: v.optional(v.boolean()),
    isDeleted: v.optional(v.boolean()),
    deletedAt: v.optional(v.number()),
    deletedFor: v.optional(v.array(v.string())),
  }).index("by_conversation", ["conversationId"]),

  reactions: defineTable({
    messageId: v.id("messages"),
    userId: v.string(), // clerkId
    emoji: v.string(),
    createdAt: v.number(),
  }).index("by_message", ["messageId"]),

  typingIndicators: defineTable({
    conversationId: v.id("conversations"),
    userId: v.string(), // clerkId
    isTyping: v.boolean(),
    lastUpdated: v.number(),
  }).index("by_conversation", ["conversationId"]),
});