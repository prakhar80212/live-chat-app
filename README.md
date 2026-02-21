# Live Chat App

A real-time chat application built with Next.js, Convex, and Clerk authentication.

## Features

- 🔐 User authentication with Clerk
- 💬 Real-time messaging
- 👥 One-on-one and group chats
- ✨ Emoji picker
- 👀 Typing indicators
- 🟢 Online/offline status
- 📱 Responsive design
- ⚡ Instant message delivery

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Convex (real-time database)
- **Authentication**: Clerk
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm/yarn/pnpm/bun package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd live-chat-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CONVEX_DEPLOYMENT=your_convex_deployment_url
NEXT_PUBLIC_CONVEX_URL=your_convex_url
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
live-chat-app/
├── app/                  # Next.js app directory
│   ├── components/       # React components
│   ├── utils/           # Utility functions
│   └── page.tsx         # Main page
├── convex/              # Convex backend functions
├── public/              # Static assets
└── package.json         # Dependencies
```

## Deployment

Deploy on [Vercel](https://vercel.com):

```bash
npm run build
```

## License

MIT
