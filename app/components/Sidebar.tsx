"use client";

import { useUser, SignOutButton } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { formatTimestamp } from "../utils/formatTimestamp";
import { useState, useEffect, useRef } from "react";
import { getAvatar } from "../utils/getAvatar";
import ProfilePhotoUpload from "./ProfilePhotoUpload";

interface SidebarProps {
  selectedConversationId: Id<"conversations"> | null;
  onSelectConversation: (id: Id<"conversations">) => void;
  onNewChat: () => void;
  onNewGroup: () => void;
}

function ConversationItem({ 
  conv, 
  isSelected, 
  onClick,
  users,
  currentUserId
}: { 
  conv: any; 
  isSelected: boolean; 
  onClick: () => void;
  users: any[];
  currentUserId: string;
}) {
  const unreadCount = useQuery(api.messages.getUnreadCount, { conversationId: conv._id }) || 0;
  
  if (conv.isGroup) {
    return (
      <div
        onClick={onClick}
        className={`px-5 py-4 border-b border-gray-200 cursor-pointer transition-all duration-300 hover-lift ${
          isSelected 
            ? "bg-gray-100 border-l-4 border-l-gray-400 shadow-sm" 
            : "hover:bg-gray-50"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gray-200 rounded-2xl flex items-center justify-center text-gray-600 font-bold shadow-sm">
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-baseline mb-1.5">
              <p className="font-bold text-gray-900 truncate text-base">{conv.groupName}</p>
              {conv.lastMessageTime && (
                <span className="text-xs text-gray-500 ml-2 font-medium">
                  {formatTimestamp(conv.lastMessageTime)}
                </span>
              )}
            </div>
            <div className="flex justify-between items-center gap-2">
              <p className="text-xs text-gray-500 font-medium">{conv.participants.length} members</p>
              {unreadCount > 0 && (
                <span className="bg-blue-500 text-white text-xs rounded-full px-2.5 py-1 min-w-[24px] text-center font-bold shadow-lg animate-bounce-in">
                  {unreadCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const otherUserId = conv.participants.find((p: string) => p !== currentUserId);
  const otherUser = users?.find((u) => u.clerkId === otherUserId);
  
  return (
    <div
      onClick={onClick}
      className={`px-5 py-4 border-b border-gray-200 cursor-pointer transition-all duration-300 hover-lift ${
        isSelected 
          ? "bg-gray-100 border-l-4 border-l-gray-400 shadow-sm" 
          : "hover:bg-gray-50"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={getAvatar(otherUser?.name, otherUser?.image)}
            alt={otherUser?.name}
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-gray-200 shadow-md"
          />
          {otherUser?.isOnline && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-3 border-white shadow-lg animate-pulse"></div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline mb-1.5">
            <p className="font-bold text-gray-900 truncate text-base">{otherUser?.name}</p>
            {conv.lastMessageTime && (
              <span className="text-xs text-gray-500 ml-2 font-medium">
                {formatTimestamp(conv.lastMessageTime)}
              </span>
            )}
          </div>
          <div className="flex justify-between items-center gap-2">
            {conv.lastMessage && (
              <p className="text-sm text-gray-600 truncate flex-1">{conv.lastMessage}</p>
            )}
            <div className="flex items-center gap-2">
              {conv.lastMessageReactions && (
                <span className="text-xs">{conv.lastMessageReactions}</span>
              )}
              {unreadCount > 0 && (
                <span className="bg-blue-500 text-white text-xs rounded-full px-2.5 py-1 min-w-[24px] text-center font-bold shadow-lg animate-bounce-in">
                  {unreadCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({ selectedConversationId, onSelectConversation, onNewChat, onNewGroup }: SidebarProps) {
  const { user } = useUser();
  const [showMenu, setShowMenu] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const conversations = useQuery(api.conversations.getUserConversations);
  const users = useQuery(api.users.getOtherUsers, user ? { clerkId: user.id } : "skip");
  const updateOnlineStatus = useMutation(api.users.updateOnlineStatus);

  const currentUser = useQuery(api.users.getAllUsers)?.find(u => u.clerkId === user?.id);

  const conversationsWithDetails = conversations?.sort((a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0));

  const handleLogout = async () => {
    await updateOnlineStatus({ isOnline: false });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-6 py-5 bg-white text-gray-900 shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="relative">
              <img
                src={getAvatar(currentUser?.name || user?.fullName || user?.username || undefined, currentUser?.image)}
                alt={user?.fullName || user?.username || "User"}
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-gray-200 shadow-lg cursor-pointer hover:ring-gray-300 transition-all"
                onClick={() => setShowMenu(!showMenu)}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-base truncate">{user?.fullName || user?.username}</p>
              <p className="text-sm text-green-600 font-medium">Online</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onNewGroup}
              className="p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95"
              title="New Group"
            >
              <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            </button>
            <button
              onClick={onNewChat}
              className="p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95"
              title="New Chat"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>

        {/* User Menu Dropdown */}
        {showMenu && (
          <div 
            ref={menuRef}
            className="absolute top-20 left-6 bg-white rounded-2xl shadow-2xl py-2 z-50 min-w-[200px] animate-scale-in border border-gray-200"
          >
            <div className="px-4 py-3 border-b border-gray-200">
              <p className="font-bold text-gray-900 text-sm truncate">{user?.fullName || user?.username}</p>
              <p className="text-xs text-gray-500 truncate">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
            <button 
              onClick={() => {
                setShowPhotoUpload(true);
                setShowMenu(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-blue-50 text-blue-600 font-medium text-sm flex items-center gap-3 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0118.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Change Photo
            </button>
            <SignOutButton>
              <button 
                onClick={handleLogout}
                className="w-full px-4 py-3 text-left hover:bg-red-50 text-red-600 font-medium text-sm flex items-center gap-3 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Log Out
              </button>
            </SignOutButton>
          </div>
        )}
      </div>

      {/* Photo Upload Modal */}
      {showPhotoUpload && (
        <ProfilePhotoUpload
          currentImage={currentUser?.image}
          userName={currentUser?.name || user?.fullName || user?.username}
          onClose={() => setShowPhotoUpload(false)}
        />
      )}

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto bg-white">
        {!conversationsWithDetails || conversationsWithDetails.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-fade-in">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full blur-xl opacity-20"></div>
              <div className="relative bg-gray-100 p-8 rounded-3xl shadow-lg">
                <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
            <p className="text-gray-800 font-bold text-lg mb-2">No conversations yet</p>
            <p className="text-sm text-gray-500 mb-6">Start a new chat to connect with friends</p>
            <button
              onClick={onNewChat}
              className="px-6 py-3 bg-blue-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Start Chatting
            </button>
          </div>
        ) : (
          <div className="animate-fade-in">
            {conversationsWithDetails.map((conv) => (
              <ConversationItem
                key={conv._id}
                conv={conv}
                isSelected={selectedConversationId === conv._id}
                onClick={() => onSelectConversation(conv._id)}
                users={users || []}
                currentUserId={user?.id || ""}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
