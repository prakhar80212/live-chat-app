"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect, useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";
import UserList from "./UserList";
import GroupChatModal from "./GroupChatModal";

export default function ChatApp() {
  const { user } = useUser();
  const [selectedConversationId, setSelectedConversationId] = useState<Id<"conversations"> | null>(null);
  const [showUserList, setShowUserList] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const createUser = useMutation(api.users.createUser);
  const updateOnlineStatus = useMutation(api.users.updateOnlineStatus);

  useEffect(() => {
    if (user) {
      createUser({
        clerkId: user.id,
        name: user.fullName || user.username || "Anonymous",
        image: user.imageUrl,
      });
    }
  }, [user, createUser]);

  useEffect(() => {
    updateOnlineStatus({ isOnline: true });

    const handleBeforeUnload = () => {
      updateOnlineStatus({ isOnline: false });
    };

    const handleVisibilityChange = () => {
      updateOnlineStatus({ isOnline: !document.hidden });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      updateOnlineStatus({ isOnline: false });
    };
  }, [updateOnlineStatus]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 overflow-hidden transition-colors duration-300">
      {/* Sidebar */}
      <div className={`${
        isMobile && selectedConversationId ? "hidden" : "block"
      } ${
        isMobile ? "w-full" : "w-96"
      } border-r border-gray-200 bg-white shadow-sm transition-all duration-300 animate-slide-right`}>
        <Sidebar
          selectedConversationId={selectedConversationId}
          onSelectConversation={setSelectedConversationId}
          onNewChat={() => setShowUserList(true)}
          onNewGroup={() => setShowGroupModal(true)}
        />
      </div>

      {/* Chat Area */}
      <div className={`${
        isMobile && !selectedConversationId ? "hidden" : "flex-1"
      } flex flex-col transition-all duration-300`}>
        {selectedConversationId ? (
          <ChatArea
            conversationId={selectedConversationId}
            onBack={isMobile ? () => setSelectedConversationId(null) : undefined}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-white dark:bg-white-900 animate-fade-in">
            <div className="text-center p-10 max-w-md">
              <div className="mb-6 inline-block">
                <div className="bg-green-100 dark:bg-green-900/10 p-8 rounded-2xl shadow-sm">
                  <svg className="w-20 h-20 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-black-200">Welcome to Live Chat</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Select a conversation to start messaging</p>
              <button
                onClick={() => setShowUserList(true)}
                className="px-6 py-2.5 bg-purple-600 text-white rounded-lg font-medium shadow-sm hover:bg-purple-700 hover:shadow-md transition-all duration-200"
              >
                Start Chatting
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showUserList && (
        <UserList
          onClose={() => setShowUserList(false)}
          onSelectUser={(conversationId) => {
            setSelectedConversationId(conversationId);
            setShowUserList(false);
          }}
        />
      )}

      {showGroupModal && (
        <GroupChatModal
          onClose={() => setShowGroupModal(false)}
          onCreateGroup={(conversationId) => {
            setSelectedConversationId(conversationId);
            setShowGroupModal(false);
          }}
        />
      )}
    </div>
  );
}
