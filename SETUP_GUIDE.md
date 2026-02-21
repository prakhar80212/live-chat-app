# Live Chat App - Real-Time Messaging Application

A modern, real-time chat application built with Next.js, TypeScript, Convex, and Clerk.

## 🚀 Features Implemented

### ✅ 1. Authentication
- Sign up with email or social login (Google, GitHub, etc.)
- Secure authentication via Clerk
- User profiles stored in Convex database
- Display logged-in user's name and avatar

### ✅ 2. User List & Search
- View all registered users (excluding yourself)
- Real-time search bar to filter users by name
- Click any user to start or open a conversation

### ✅ 3. One-on-One Direct Messages
- Private conversations between two users
- Real-time message delivery using Convex subscriptions
- Sidebar showing all conversations with message previews
- Most recent conversations appear first

### ✅ 4. Message Timestamps
- Smart timestamp formatting:
  - Today's messages: "2:34 PM"
  - This year: "Feb 15, 2:34 PM"
  - Different year: "2024, Feb 15, 2:34 PM"

### ✅ 5. Empty States
- Helpful messages when:
  - No conversations exist yet
  - No messages in a conversation
  - No search results found
  - No other users registered

### ✅ 6. Responsive Layout
- **Desktop**: Sidebar + chat area side by side
- **Mobile**: 
  - Conversation list as default view
  - Full-screen chat when conversation selected
  - Back button to return to conversation list

### ✅ 7. Online/Offline Status
- Green indicator next to online users
- Real-time status updates
- Tracks when users open/close the app
- Handles browser tab visibility changes

### ✅ 8. Typing Indicator
- Shows when the other user is typing
- Animated pulsing dots
- Disappears after 2 seconds of inactivity
- Clears when message is sent

### ✅ 9. Unread Message Count
- Badge showing number of unread messages per conversation
- Updates in real-time
- Clears when conversation is opened
- Only counts messages from other users

### ✅ 10. Smart Auto-Scroll
- Automatically scrolls to latest message
- Detects if user scrolled up to read history
- Shows "↓" button when new messages arrive while scrolled up
- Click button to jump to latest messages

## 🛠️ Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Convex** - Backend, database, and real-time subscriptions
- **Clerk** - Authentication and user management
- **Tailwind CSS** - Styling

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Set Up Clerk

1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Copy your API keys from the Clerk dashboard
4. The keys are already in `.env.local` (update if needed):

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
```

### Step 3: Set Up Convex

1. Install Convex CLI globally (if not already installed):
```bash
npm install -g convex
```

2. Login to Convex:
```bash
npx convex login
```

3. Initialize Convex (already done, but run if needed):
```bash
npx convex dev
```

This will:
- Create a Convex project
- Deploy your schema and functions
- Generate the Convex URL (already in `.env.local`)

### Step 4: Configure Clerk + Convex Integration

1. In your Clerk dashboard, go to **JWT Templates**
2. Create a new template called "convex"
3. Copy the JWKS endpoint URL
4. The `convex/auth.config.ts` is already configured with your Clerk domain

### Step 5: Run the Development Server

```bash
# Terminal 1: Run Convex backend
npx convex dev

# Terminal 2: Run Next.js frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 How to Use

1. **Sign Up/Login**: Click "Sign In" and create an account or use social login
2. **Find Users**: Click the "+" button in the sidebar to see all users
3. **Start Chatting**: Click on any user to start a conversation
4. **Send Messages**: Type in the input box and click "Send" or press Enter
5. **View Status**: See green dots next to online users
6. **Check Unread**: Blue badges show unread message counts
7. **Mobile**: Use the back arrow to return to conversation list

## 📁 Project Structure

```
live-chat-app/
├── app/
│   ├── components/
│   │   ├── ChatApp.tsx          # Main app container
│   │   ├── Sidebar.tsx          # Conversation list
│   │   ├── ChatArea.tsx         # Message display & input
│   │   └── UserList.tsx         # User search modal
│   ├── utils/
│   │   └── formatTimestamp.ts   # Timestamp formatting
│   ├── ConvexClientProvider.tsx # Convex + Clerk provider
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── convex/
│   ├── schema.ts                # Database schema
│   ├── users.ts                 # User functions
│   ├── conversations.ts         # Conversation functions
│   ├── messages.ts              # Message functions
│   ├── typing.ts                # Typing indicator functions
│   └── auth.config.ts           # Clerk integration
└── package.json
```

## 🔑 Key Features Explained

### Real-Time Updates
All data updates happen in real-time using Convex subscriptions. When any user sends a message, updates their status, or starts typing, all connected clients receive the update instantly.

### Database Schema
- **users**: Stores user profiles, online status, and last seen time
- **conversations**: Tracks participants and last message info
- **messages**: Stores all messages with read status
- **typingIndicators**: Tracks who is currently typing

### Responsive Design
Uses Tailwind's responsive breakpoints (`md:`) to show/hide elements based on screen size. Mobile users get a single-column view that switches between list and chat.

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables from `.env.local`
5. Deploy!

### Deploy Convex to Production

```bash
npx convex deploy
```

Update your `.env.local` with the production Convex URL.

## 🐛 Troubleshooting

**Issue**: Clerk authentication not working
- **Solution**: Verify your Clerk keys in `.env.local` and restart the dev server

**Issue**: Convex functions not updating
- **Solution**: Make sure `npx convex dev` is running in a separate terminal

**Issue**: Real-time updates not working
- **Solution**: Check that ConvexClientProvider is properly wrapping your app

**Issue**: TypeScript errors
- **Solution**: Run `npx convex dev` to regenerate types

## 📝 Assignment Checklist

- [x] 1. Authentication with Clerk
- [x] 2. User list & search functionality
- [x] 3. One-on-one direct messages
- [x] 4. Message timestamps (smart formatting)
- [x] 5. Empty states for all views
- [x] 6. Responsive layout (desktop + mobile)
- [x] 7. Online/offline status indicators
- [x] 8. Typing indicators
- [x] 9. Unread message counts
- [x] 10. Smart auto-scroll with manual control

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Convex Documentation](https://docs.convex.dev)
- [Clerk Documentation](https://clerk.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 📅 Timeline

Assignment due: **February 24, 2025**

All features are now complete and ready for submission! 🎉

## 🤝 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the Convex and Clerk documentation
3. Ensure all environment variables are set correctly
4. Make sure both `npx convex dev` and `npm run dev` are running

---

Built with ❤️ using Next.js, Convex, and Clerk
