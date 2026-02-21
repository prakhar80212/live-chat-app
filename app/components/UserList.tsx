"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { getAvatar } from "../utils/getAvatar";

interface UserListProps {
  onClose: () => void;
  onSelectUser: (conversationId: Id<"conversations">) => void;
}

export default function UserList({ onClose, onSelectUser }: UserListProps) {
  const { user } = useUser();
  const [search, setSearch] = useState("");
  const users = useQuery(api.users.getOtherUsers, user ? { clerkId: user.id } : "skip");
  const getOrCreateConversation = useMutation(api.conversations.getOrCreateConversation);

  const filteredUsers = users?.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectUser = async (otherUserId: string) => {
    const conversationId = await getOrCreateConversation({ otherUserId });
    onSelectUser(conversationId);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-scale-in overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-8 py-6 bg-gradient-to-r from-purple-500 via-purple-400 to-pink-500 text-white flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-1">New Chat</h2>
            <p className="text-purple-100 text-sm font-medium">Select a user to start chatting</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-white hover:bg-white/20 p-3 rounded-2xl transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="p-6 bg-gradient-to-b from-gray-50 to-white">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-6 py-4 pl-14 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 placeholder-gray-400"
              autoFocus
            />
            <svg className="w-6 h-6 text-gray-400 absolute left-5 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* User List */}
        <div className="max-h-[400px] overflow-y-auto">
          {!filteredUsers || filteredUsers.length === 0 ? (
            <div className="p-12 text-center text-gray-500 animate-fade-in">
              <div className="relative mb-6 inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full blur-xl opacity-20"></div>
                <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-3xl shadow-lg">
                  <svg className="w-16 h-16 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-lg font-bold text-gray-800 mb-2">{search ? "No users found" : "No other users yet"}</p>
              {search && <p className="text-sm text-gray-500">Try a different search term</p>}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredUsers.map((u) => (
                <div
                  key={u._id}
                  onClick={() => handleSelectUser(u.clerkId)}
                  className="px-6 py-5 cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 transition-all duration-300 flex items-center gap-4 group hover-lift"
                >
                  <div className="relative">
                    <img
                      src={getAvatar(u.name, u.image)}
                      alt={u.name}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white dark:ring-gray-700 shadow-lg group-hover:ring-purple-500 transition-all duration-300"
                    />
                    {u.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-white shadow-lg animate-pulse-glow"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors text-lg">{u.name}</p>
                    {u.isOnline ? (
                      <p className="text-sm text-green-600 font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Active now
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500 font-medium">Offline</p>
                    )}
                  </div>
                  <svg className="w-6 h-6 text-gray-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
