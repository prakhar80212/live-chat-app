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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-scale-in overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-5 bg-white border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">New Chat</h2>
            <p className="text-gray-500 text-sm mt-0.5">Select a user to start chatting</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2.5 rounded-xl transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="p-5 bg-gray-50/50">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3.5 pl-11 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-gray-700 placeholder-gray-400 text-sm"
              autoFocus
            />
            <svg className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* User List */}
        <div className="max-h-[320px] overflow-y-auto">
          {!filteredUsers || filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mb-5 inline-flex items-center justify-center w-20 h-20 bg-teal-50 rounded-2xl">
                <svg className="w-10 h-10 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-base font-semibold text-gray-900 mb-1">
                {search ? "No users found" : "No other users yet"}
              </p>
              {search && <p className="text-sm text-gray-500">Try a different search term</p>}
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filteredUsers.map((u) => (
                <div
                  key={u._id}
                  onClick={() => handleSelectUser(u.clerkId)}
                  className="px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200 flex items-center gap-4 group"
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-semibold text-lg shadow-sm">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    {u.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate group-hover:text-teal-600 transition-colors">
                      {u.name}
                    </p>
                    {u.isOnline ? (
                      <p className="text-xs text-green-600 font-medium flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        Online
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400 mt-0.5">Offline</p>
                    )}
                  </div>
                  <svg className="w-5 h-5 text-gray-300 group-hover:text-teal-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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