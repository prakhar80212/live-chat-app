"use client";

import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useRef } from "react";

interface ProfilePhotoUploadProps {
  currentImage?: string;
  userName?: string;
  onClose: () => void;
}

export default function ProfilePhotoUpload({ currentImage, userName, onClose }: ProfilePhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateProfileImage = useMutation(api.users.updateProfileImage);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!preview) return;

    setUploading(true);
    try {
      await updateProfileImage({ image: preview });
      onClose();
    } catch (error) {
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl animate-scale-in overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="px-8 py-6 bg-gradient-to-r from-teal-600 to-teal-500 text-white flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">Update Profile Photo</h2>
            <p className="text-teal-100 text-sm font-medium">Choose a new profile picture</p>
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

        <div className="p-8">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <img
                src={preview || currentImage || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userName || "user")}&backgroundColor=0d9488`}
                alt="Profile"
                className="w-40 h-40 rounded-full object-cover ring-4 ring-teal-500 shadow-xl"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-2 right-2 bg-teal-600 text-white p-3 rounded-full shadow-lg hover:bg-teal-700 transition-all hover:scale-110"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 border-2 border-teal-500 text-teal-600 rounded-xl hover:bg-teal-50 transition-all font-medium"
            >
              Choose Photo
            </button>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex gap-3 bg-gray-50">
          <button 
            onClick={onClose} 
            className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-100 transition-all font-bold text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!preview || uploading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold"
          >
            {uploading ? "Uploading..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
