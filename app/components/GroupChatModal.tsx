"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { getAvatar } from "../utils/getAvatar";

interface GroupChatModalProps {
  onClose: () => void;
  onCreateGroup: (conversationId: Id<"conversations">) => void;
}

export default function GroupChatModal({ onClose, onCreateGroup }: GroupChatModalProps) {
  const { user } = useUser();
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const users = useQuery(api.users.getOtherUsers, user ? { clerkId: user.id } : "skip");
  const createGroup = useMutation(api.conversations.createGroupConversation);

  const filteredUsers = users?.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleCreate = async () => {
    if (!groupName.trim() || selectedUsers.length === 0) return;
    const conversationId = await createGroup({
      participantIds: selectedUsers,
      groupName: groupName.trim(),
    });
    onCreateGroup(conversationId);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-scale-in overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-8 py-6 bg-gradient-to-r from-purple-500 via-purple-400 to-pink-500 text-white flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-1">New Group</h2>
            <p className="text-purple-100 text-sm font-medium">Create a group chat with friends</p>
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

        {/* Form */}
        <div className="p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Group Name</label>
            <input
              type="text"
              placeholder="Enter group name..."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-6 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 placeholder-gray-400"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Search Members</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-6 py-4 pl-14 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 placeholder-gray-400"
              />
              <svg className="w-6 h-6 text-gray-400 absolute left-5 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl p-4 border-2 border-purple-200 dark:border-purple-800 animate-slide-down">
              <p className="text-sm font-bold text-purple-700 dark:text-purple-300 mb-3">Selected Members ({selectedUsers.length})</p>
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((userId) => {
                  const selectedUser = users?.find((u) => u.clerkId === userId);
                  return (
                    <span key={userId} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 shadow-lg hover:shadow-xl transition-all animate-bounce-in font-medium">
                      {selectedUser?.name}
                      <button 
                        onClick={() => toggleUser(userId)} 
                        className="hover:bg-white/20 rounded-full p-1 transition-all hover:scale-110"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* User List */}
        <div className="max-h-[300px] overflow-y-auto border-t border-gray-100">
          {filteredUsers && filteredUsers.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {filteredUsers.map((u) => (
                <div
                  key={u._id}
                  onClick={() => toggleUser(u.clerkId)}
                  className={`px-6 py-4 cursor-pointer transition-all duration-300 flex items-center gap-4 hover-lift ${
                    selectedUsers.includes(u.clerkId) 
                      ? "bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 border-l-4 border-l-purple-500" 
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(u.clerkId)}
                    onChange={() => {}}
                    className="w-5 h-5 text-purple-500 rounded-lg border-2 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  />
                  <img 
                    src={getAvatar(u.name, u.image)} 
                    alt={u.name} 
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white shadow-md" 
                  />
                  <p className="font-bold text-gray-900 dark:text-gray-100 flex-1">{u.name}</p>
                  {selectedUsers.includes(u.clerkId) && (
                    <svg className="w-6 h-6 text-purple-500 animate-bounce-in" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p className="font-medium">No users found</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex gap-3 bg-gray-50">
          <button 
            onClick={onClose} 
            className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-2xl hover:bg-gray-100 transition-all duration-300 font-bold text-gray-700 hover:scale-105 active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!groupName.trim() || selectedUsers.length === 0}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:shadow-xl hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none transition-all duration-300 font-bold hover:scale-105 active:scale-95"
          >
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
}
