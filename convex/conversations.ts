import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getOrCreateConversation = mutation({
  args: {
    otherUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const currentUserId = identity.subject;

    // Check if conversation already exists
    const conversations = await ctx.db.query("conversations").collect();

    const existing = conversations.find(
      (c) =>
        !c.isGroup &&
        c.participants.includes(currentUserId) &&
        c.participants.includes(args.otherUserId)
    );

    if (existing) return existing._id;

    // Create new conversation
    const newId = await ctx.db.insert("conversations", {
      participants: [currentUserId, args.otherUserId],
      isGroup: false,
    });

    return newId;
  },
});

export const createGroupConversation = mutation({
  args: {
    participantIds: v.array(v.string()),
    groupName: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const currentUserId = identity.subject;
    const allParticipants = [currentUserId, ...args.participantIds];

    const newId = await ctx.db.insert("conversations", {
      participants: allParticipants,
      isGroup: true,
      groupName: args.groupName,
    });

    return newId;
  },
});

export const getUserConversations = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const currentUserId = identity.subject;

    const conversations = await ctx.db.query("conversations").collect();

    const userConversations = conversations.filter((c) =>
      c.participants.includes(currentUserId)
    );

    // Filter reactions for deleted messages
    const conversationsWithFilteredReactions = await Promise.all(
      userConversations.map(async (conv) => {
        if (!conv.lastMessageTime) return conv;

        // Get the last message
        const messages = await ctx.db
          .query("messages")
          .withIndex("by_conversation", (q) => q.eq("conversationId", conv._id))
          .order("desc")
          .collect();

        const lastMsg = messages[0];
        
        // If current user deleted the last message, don't show reactions
        if (lastMsg?.deletedFor?.includes(currentUserId)) {
          return { ...conv, lastMessageReactions: undefined };
        }

        return conv;
      })
    );

    return conversationsWithFilteredReactions;
  },
});