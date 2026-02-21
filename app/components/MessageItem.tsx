"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useState, useEffect, useRef } from "react";
import { formatTimestamp } from "../utils/formatTimestamp";
import { getAvatar } from "../utils/getAvatar";

const REACTIONS = ["👍", "❤️", "😂", "😮", "😢"];

interface MessageItemProps {
  message: any;
  isOwn: boolean;
  showAvatar: boolean;
  senderImage?: string;
  senderName?: string;
  currentUserId: string;
}

export default function MessageItem({ message, isOwn, showAvatar, senderImage, senderName, currentUserId }: MessageItemProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const reactionsRef = useRef<HTMLDivElement>(null);
  const deleteMessage = useMutation(api.messages.deleteMessage);
  const addReaction = useMutation(api.messages.addReaction);
  const reactions = useQuery(api.messages.getReactions, { messageId: message._id });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
      if (reactionsRef.current && !reactionsRef.current.contains(event.target as Node)) {
        setShowReactions(false);
      }
    };

    if (showMenu || showReactions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu, showReactions]);

  const handleDelete = async () => {
    await deleteMessage({ messageId: message._id });
    setShowDeleteModal(false);
    setShowMenu(false);
  };

  const handleReaction = async (emoji: string) => {
    await addReaction({ messageId: message._id, emoji });
    setShowReactions(false);
  };

  const groupedReactions = reactions?.reduce((acc: any, r: any) => {
    if (!acc[r.emoji]) acc[r.emoji] = [];
    acc[r.emoji].push(r.userId);
    return acc;
  }, {});

  const userReacted = (emoji: string) => {
    return groupedReactions?.[emoji]?.includes(currentUserId);
  };

  if (message.isDeleted) {
    return (
      <div className={`flex ${isOwn ? "justify-end" : "justify-start"} px-4 py-1 animate-fade-in`}>
        <div className={`flex items-end gap-2 max-w-md lg:max-w-lg ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
          {showAvatar && !isOwn && <div className="w-8 h-8" />}
          <div className={`${
            isOwn ? "bg-gray-100" : "bg-gray-50"
          } rounded-2xl px-4 py-2.5 shadow-sm ${!showAvatar && !isOwn ? "ml-10" : ""}`}>
            <p className="text-gray-400 italic text-xs flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
              </svg>
              This message was deleted
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} px-4 py-1 group animate-fade-in`}>
      <div className={`flex items-end gap-2 max-w-[75%] md:max-w-md lg:max-w-lg ${isOwn ? "flex-row-reverse" : "flex-row"} relative`}>
        {showAvatar && !isOwn && (
          <img 
            src={getAvatar(senderName, senderImage)} 
            alt={senderName} 
            className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm flex-shrink-0" 
          />
        )}
        
        <div className="relative flex-1 min-w-0">
          <div className={`${
            isOwn 
              ? "bg-blue-500 text-white" 
              : "bg-white text-gray-800 shadow-sm border border-gray-100"
          } rounded-2xl ${
            isOwn ? "rounded-br-sm" : "rounded-bl-sm"
          } px-3.5 py-2 transition-all duration-200 ${!showAvatar && !isOwn ? "ml-10" : ""}`}>
            {!isOwn && showAvatar && (
              <p className="text-[10px] font-semibold text-blue-600 mb-0.5">{senderName}</p>
            )}
            <p className="text-[15px] leading-snug break-words">{message.text}</p>
            <div className={`flex items-center gap-1 mt-1 ${isOwn ? "justify-end" : "justify-start"}`}>
              <p className={`text-[10px] ${
                isOwn ? "text-blue-100" : "text-gray-400"
              }`}>
                {formatTimestamp(message.createdAt)}
              </p>
              {isOwn && (
                <svg className="w-3.5 h-3.5 text-blue-100" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>

          {/* Reactions */}
          {groupedReactions && Object.keys(groupedReactions).length > 0 && (
            <div className={`flex gap-1 mt-1 flex-wrap ${isOwn ? "justify-end" : "justify-start"}`}>
              {Object.entries(groupedReactions).map(([emoji, userIds]: [string, any]) => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 transition-all duration-200 hover:scale-110 active:scale-100 ${
                    userReacted(emoji) 
                      ? "bg-blue-100 ring-1 ring-blue-400" 
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <span className="text-sm leading-none">{emoji}</span>
                  <span className="text-[10px] font-semibold text-gray-600">{userIds.length}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className={`flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${isOwn ? "flex-row-reverse" : ""} self-end pb-1`}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowReactions(!showReactions);
              setShowMenu(false);
            }}
            className={`p-1.5 rounded-full transition-all duration-200 hover:scale-110 active:scale-100 ${
              showReactions ? "bg-gray-200 text-gray-700" : "bg-gray-100 hover:bg-gray-200 text-gray-600"
            }`}
            title="React"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
            </svg>
          </button>
          {isOwn && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
                setShowReactions(false);
              }}
              className={`p-1.5 rounded-full transition-all duration-200 hover:scale-110 active:scale-100 ${
                showMenu ? "bg-red-100 text-red-600" : "bg-gray-100 hover:bg-gray-200 text-gray-600"
              }`}
              title="More"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          )}
        </div>

        {/* Reaction Picker */}
        {showReactions && (
          <div 
            ref={reactionsRef}
            className={`absolute ${isOwn ? "right-0" : "left-10"} top-full mt-1 bg-white backdrop-blur-xl rounded-full shadow-xl px-2 py-2 flex gap-1 z-50 border border-gray-200 animate-scale-in`}
          >
            {REACTIONS.map((emoji) => (
              <button
                key={emoji}
                onClick={(e) => {
                  e.stopPropagation();
                  handleReaction(emoji);
                }}
                className="text-2xl hover:scale-125 active:scale-110 transition-transform duration-200 p-1.5 hover:bg-gray-100 rounded-full"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* Delete Menu */}
        {showMenu && isOwn && (
          <div 
            ref={menuRef}
            className="absolute right-0 top-full mt-1 bg-white backdrop-blur-xl rounded-xl shadow-xl py-1 z-50 border border-gray-200 min-w-[160px] animate-scale-in"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteModal(true);
                setShowMenu(false);
              }}
              className="px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 text-sm w-full text-left flex items-center gap-2.5 transition-colors duration-200 font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Message
            </button>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] animate-fade-in" onClick={() => setShowDeleteModal(false)}>
            <div className="bg-white rounded-3xl p-6 max-w-sm mx-4 shadow-2xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
              <div className="text-center mb-5">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1.5">Delete Message?</h3>
                <p className="text-sm text-gray-500">This will be deleted for everyone</p>
              </div>
              <div className="flex gap-2.5">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-5 py-2.5 border-2 border-gray-200 rounded-xl hover:bg-gray-50 active:scale-95 transition-all duration-200 font-semibold text-gray-700 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 active:scale-95 transition-all duration-200 font-semibold shadow-lg text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
