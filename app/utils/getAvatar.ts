export function getAvatar(name: string, image?: string): string {
  // Only use image if it's a valid uploaded image (not a Clerk placeholder)
  if (image && !image.includes('img.clerk.com')) return image;
  
  const seed = encodeURIComponent(name || "user");
  return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&backgroundColor=0d9488,14b8a6,06b6d4&textColor=ffffff`;
}
