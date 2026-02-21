"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { getAvatar } from "../utils/getAvatar";

interface GroupMembersModalProps {
  participants: string[];
  onClose: () => void;
}

export default function GroupMembersModal({ participants, onClose }: GroupMembersModalProps) {
  const users = useQuery(api.users.getAllUsers);

  const members = participants
    .map(id => users?.find(u => u.clerkId === id))
    .filter(Boolean);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl animate-scale-in overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-8 py-6 bg-gradient-to-r from-purple-500 via-purple-400 to-pink-500 text-white flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">Group Members</h2>
            <p className="text-purple-100 text-sm font-medium">{members.length} {members.length === 1 ? 'member' : 'members'}</p>
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

        {/* Members List */}
        <div className="max-h-[500px] overflow-y-auto p-4">
          <div className="space-y-2">
            {members.map((member, index) => (
              <div 
                key={member?.clerkId} 
                className="flex items-center gap-4 p-4 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 rounded-2xl transition-all duration-300 group hover-lift animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative">
                  <img
                    src={getAvatar(member?.name, member?.image)}
                    alt={member?.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white dark:ring-gray-700 shadow-lg group-hover:ring-purple-500 transition-all"
                  />
                  {member?.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-3 border-white shadow-lg animate-pulse-glow"></div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 dark:text-gray-100 text-lg group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{member?.name}</p>
                  {member?.isOnline ? (
                    <p className="text-sm text-green-600 font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      Active now
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500 font-medium">Offline</p>
                  )}
                </div>
                {member?.isOnline && (
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300 font-bold hover:scale-105 active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
