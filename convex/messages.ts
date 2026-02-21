import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const senderId = identity.subject;

    const messageId = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      senderId,
      text: args.text,
      createdAt: Date.now(),
      isRead: false,
      isDeleted: false,
    });

    // Update last message in conversation
    await ctx.db.patch(args.conversationId, {
      lastMessage: args.text,
      lastMessageTime: Date.now(),
      lastMessageReactions: undefined,
    });

    return messageId;
  },
});

export const getMessages = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .collect();
  },
});

export const deleteMessage = mutation({
  args: {
    messageId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const message = await ctx.db.get(args.messageId);
    if (!message) throw new Error("Message not found");
    if (message.senderId !== identity.subject) throw new Error("Unauthorized");

    await ctx.db.patch(args.messageId, {
      isDeleted: true,
      deletedAt: Date.now(),
    });
    
    const reactions = await ctx.db
      .query("reactions")
      .withIndex("by_message", (q) => q.eq("messageId", args.messageId))
      .collect();
    
    for (const reaction of reactions) {
      await ctx.db.delete(reaction._id);
    }
    
    await ctx.db.patch(message.conversationId, {
      lastMessage: "This message was deleted",
      lastMessageReactions: undefined,
    });
  },
});

export const addReaction = mutation({
  args: {
    messageId: v.id("messages"),
    emoji: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const existingReaction = await ctx.db
      .query("reactions")
      .withIndex("by_message", (q) => q.eq("messageId", args.messageId))
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .filter((q) => q.eq(q.field("emoji"), args.emoji))
      .first();

    if (existingReaction) {
      await ctx.db.delete(existingReaction._id);
    } else {
      await ctx.db.insert("reactions", {
        messageId: args.messageId,
        userId: identity.subject,
        emoji: args.emoji,
        createdAt: Date.now(),
      });
    }

    const message = await ctx.db.get(args.messageId);
    if (message) {
      const lastMessage = await ctx.db
        .query("messages")
        .withIndex("by_conversation", (q) => q.eq("conversationId", message.conversationId))
        .order("desc")
        .first();

      if (lastMessage?._id === args.messageId) {
        const allReactions = await ctx.db
          .query("reactions")
          .withIndex("by_message", (q) => q.eq("messageId", args.messageId))
          .collect();
        
        const latestReaction = allReactions.sort((a, b) => b.createdAt - a.createdAt)[0];
        
        await ctx.db.patch(message.conversationId, {
          lastMessageReactions: latestReaction?.emoji || undefined,
        });
      }
    }
  },
});

export const getReactions = query({
  args: {
    messageId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reactions")
      .withIndex("by_message", (q) => q.eq("messageId", args.messageId))
      .collect();
  },
});

export const markMessagesAsRead = mutation({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .collect();

    // Mark messages from other users as read
    for (const msg of messages) {
      if (msg.senderId !== identity.subject && !msg.isRead) {
        await ctx.db.patch(msg._id, { isRead: true });
      }
    }
  },
});

export const getUnreadCount = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return 0;

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .collect();

    return messages.filter(
      (msg) => msg.senderId !== identity.subject && !msg.isRead && !msg.isDeleted
    ).length;
  },
});