"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useState, useRef, useEffect } from "react";
import MessageItem from "./MessageItem";
import GroupMembersModal from "./GroupMembersModal";
import { getAvatar } from "../utils/getAvatar";

interface ChatAreaProps {
  conversationId: Id<"conversations">;
  onBack?: () => void;
}

export default function ChatArea({ conversationId, onBack }: ChatAreaProps) {
  const { user } = useUser();
  const [message, setMessage] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [showGroupMembers, setShowGroupMembers] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  
  const messages = useQuery(api.messages.getMessages, { conversationId });
  const sendMessage = useMutation(api.messages.sendMessage);
  const markAsRead = useMutation(api.messages.markMessagesAsRead);
  const setTyping = useMutation(api.typing.setTyping);
  const typingUsers = useQuery(api.typing.getTypingUsers, { conversationId });
  const conversation = useQuery(api.conversations.getUserConversations);
  const users = useQuery(api.users.getOtherUsers, user ? { clerkId: user.id } : "skip");

  const currentConv = conversation?.find((c) => c._id === conversationId);
  const isGroup = currentConv?.isGroup;
  const isOtherUserTyping = typingUsers && typingUsers.length > 0;

  const otherUserId = !isGroup ? currentConv?.participants.find((p) => p !== user?.id) : null;
  const otherUser = otherUserId ? users?.find((u) => u.clerkId === otherUserId) : null;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  useEffect(() => {
    const handleClickAnywhere = () => {
      if (showEmojiPicker) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("click", handleClickAnywhere);
    return () => {
      document.removeEventListener("click", handleClickAnywhere);
    };
  }, [showEmojiPicker]);



  useEffect(() => {
    markAsRead({ conversationId });
  }, [conversationId, messages, markAsRead]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!showScrollButton) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, showScrollButton]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    setSendError(null);
    
    setTyping({ conversationId, isTyping: true });
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      setTyping({ conversationId, isTyping: false });
    }, 2000);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    setTyping({ conversationId, isTyping: false });

    setIsSending(true);
    setSendError(null);

    try {
      await sendMessage({
        conversationId,
        text: message,
      });
      setMessage("");
      setTimeout(() => inputRef.current?.focus(), 0);
    } catch (error) {
      setSendError("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollButton(false);
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const getUserInfo = (userId: string) => {
    return users?.find((u) => u.clerkId === userId);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-5 py-3.5 bg-white text-gray-900 shadow-sm border-b border-gray-200 animate-slide-down">
        <div className="flex items-center gap-3">
          {onBack && (
            <button 
              onClick={onBack} 
              className="md:hidden hover:bg-white/20 p-2 rounded-lg transition-all duration-200 hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {isGroup ? (
            <>
              <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center shadow-sm">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <div className="flex-1 cursor-pointer" onClick={() => setShowGroupMembers(true)}>
                <p className="font-semibold text-gray-900">{currentConv?.groupName}</p>
                <p className="text-xs text-gray-600">{currentConv?.participants.length} members</p>
              </div>
            </>
          ) : (
            <>
              <div className="relative">
                <img
                  src={getAvatar(otherUser?.name, otherUser?.image)}
                  alt={otherUser?.name}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-white/20 shadow-md"
                />
                {otherUser?.isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{otherUser?.name}</p>
                {isOtherUserTyping ? (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <span>typing</span>
                    <div className="flex gap-0.5">
                      <div className="w-1 h-1 bg-gray-400 rounded-full typing-dot"></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full typing-dot"></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full typing-dot"></div>
                    </div>
                  </div>
                ) : otherUser?.isOnline ? (
                  <p className="text-xs text-green-600">Active now</p>
                ) : (
                  <p className="text-xs text-gray-500">Offline</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={messagesContainerRef} 
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-white"
      >
        {!messages ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-3 border-gray-200 border-t-purple-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 animate-fade-in">
            <div className="text-center max-w-sm">
              <div className="bg-gray-100 p-6 rounded-2xl mb-4 mx-auto w-fit shadow-sm">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="font-semibold text-gray-700 mb-1">No messages yet</p>
              <p className="text-sm text-gray-500">Start the conversation</p>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isOwn = msg.senderId === user?.id;
            const showAvatar = !isOwn && (index === messages.length - 1 || messages[index + 1]?.senderId !== msg.senderId);
            const sender = getUserInfo(msg.senderId);
            return (
              <MessageItem
                key={msg._id}
                message={msg}
                isOwn={isOwn}
                showAvatar={showAvatar || isGroup}
                senderImage={sender?.image}
                senderName={sender?.name}
                currentUserId={user?.id || ""}
              />
            );
          })
        )}
        
        {/* Typing Indicator */}
        {isOtherUserTyping && (
          <div className="flex justify-start animate-bounce-in">
            <div className="flex items-end gap-2">
              {!isGroup && otherUser && (
                <img
                  src={getAvatar(otherUser.name, otherUser.image)}
                  alt={otherUser.name}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-white shadow-sm"
                />
              )}
              <div className="bg-gray-100 rounded-xl rounded-bl-sm px-4 py-2 shadow-sm border border-gray-200">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to Bottom Button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-20 right-6 bg-gray-600 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 hover:shadow-xl transition-all duration-200 z-10 animate-bounce-in"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      )}

      {/* Input Area */}
      <div className="px-4 py-3 bg-white border-t border-gray-200 shadow-sm animate-slide-up">
        {sendError && (
          <div className="mb-2 px-3 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center justify-between animate-slide-down">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {sendError}
            </span>
            <button onClick={() => setSendError(null)} className="text-red-500 hover:text-red-700">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={handleInputChange}
              onBlur={(e) => setTimeout(() => e.target.focus(), 0)}
              placeholder="Type a message..."
              className="w-full px-4 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white transition-all text-gray-800 placeholder-gray-400"
              disabled={isSending}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2" ref={emojiPickerRef}>
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`p-1.5 rounded-full transition-all duration-200 ${
                  showEmojiPicker ? "bg-gray-200 text-gray-700" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              
              {showEmojiPicker && (
                <div className="absolute bottom-full right-0 mb-2 bg-white rounded-2xl shadow-2xl p-4 border border-gray-200 animate-scale-in z-50 w-[280px]">
                  <div className="grid grid-cols-7 gap-2">
                    {["😀", "😂", "😍", "🥰", "😎", "🤔", "😊", "😢", "😭", "😡", "🤗", "🤩", "😴", "🤤", "😱", "🥳", "🤯", "😇", "👍", "👎", "👏", "🙏", "💪", "✌️", "🤝", "👋", "🤙", "✋", "❤️", "💕", "💖", "💗", "💙", "💚", "💛", "🧡", "🔥", "⭐", "✨", "💫", "🎉", "🎊"].map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => handleEmojiSelect(emoji)}
                        className="text-2xl hover:scale-125 active:scale-100 transition-transform duration-200 p-2 hover:bg-gray-100 rounded-lg flex items-center justify-center"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={!message.trim() || isSending}
            className="p-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md"
          >
            {isSending ? (
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </form>
      </div>

      {/* Group Members Modal */}
      {showGroupMembers && currentConv && (
        <GroupMembersModal
          participants={currentConv.participants}
          onClose={() => setShowGroupMembers(false)}
        />
      )}
    </div>
  );
}
