# Quick Commands Reference

## Development

### Start the app (requires 2 terminals)

**Terminal 1 - Convex Backend:**
```bash
npx convex dev
```

**Terminal 2 - Next.js Frontend:**
```bash
npm run dev
```

Then open: http://localhost:3000

## Installation

```bash
# Install dependencies
npm install

# Install Convex CLI globally (one-time)
npm install -g convex
```

## Convex Commands

```bash
# Login to Convex
npx convex login

# Start development server
npx convex dev

# Deploy to production
npx convex deploy

# View Convex dashboard
npx convex dashboard

# Clear all data (careful!)
npx convex data clear
```

## Useful Development Commands

```bash
# Check for TypeScript errors
npm run build

# Run linter
npm run lint

# Format code (if you have prettier)
npx prettier --write .
```

## Environment Variables

Create/update `.env.local`:

```env
# Convex
CONVEX_DEPLOYMENT=dev:your-deployment
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

## Troubleshooting Commands

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Regenerate Convex types
npx convex dev --once

# Check Convex logs
npx convex logs
```

## Testing with Multiple Users

### Option 1: Different Browsers
- Chrome: http://localhost:3000
- Firefox: http://localhost:3000

### Option 2: Incognito Mode
- Normal window: User 1
- Incognito window: User 2

### Option 3: Different Devices
- Computer: http://localhost:3000
- Phone (same network): http://YOUR_LOCAL_IP:3000

To find your local IP:
```bash
# Windows
ipconfig

# Mac/Linux
ifconfig
```

## Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Deploy Convex to Production

```bash
# Deploy Convex functions
npx convex deploy

# Get production URL
# Update NEXT_PUBLIC_CONVEX_URL in Vercel environment variables
```

## Database Management

### View Data in Convex Dashboard

```bash
npx convex dashboard
```

Then navigate to:
- **Data** tab to view all tables
- **Logs** tab to see function calls
- **Functions** tab to test functions manually

### Clear All Data (Development Only!)

```bash
npx convex data clear
```

## Git Commands (for submission)

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Complete live chat app with all features"

# Push to GitHub
git remote add origin YOUR_GITHUB_URL
git push -u origin main
```

## Quick Feature Test

```bash
# 1. Start both servers (2 terminals)
npx convex dev
npm run dev

# 2. Open in 2 browsers
# Chrome: http://localhost:3000
# Firefox: http://localhost:3000

# 3. Sign up as different users in each

# 4. Test all features from TESTING_GUIDE.md
```

## Common Issues

### Port already in use
```bash
# Kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### Convex not connecting
```bash
# Check if convex dev is running
# Check .env.local has correct NEXT_PUBLIC_CONVEX_URL
# Restart both terminals
```

### TypeScript errors
```bash
# Regenerate types
npx convex dev --once

# Restart VS Code TypeScript server
# Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

## File Structure Quick Reference

```
live-chat-app/
├── app/
│   ├── components/          # React components
│   ├── utils/              # Helper functions
│   ├── page.tsx            # Home page
│   └── layout.tsx          # Root layout
├── convex/
│   ├── schema.ts           # Database schema
│   ├── users.ts            # User functions
│   ├── conversations.ts    # Conversation functions
│   ├── messages.ts         # Message functions
│   └── typing.ts           # Typing indicators
├── .env.local              # Environment variables
└── package.json            # Dependencies
```

## Keyboard Shortcuts (in app)

- **Enter** - Send message
- **Esc** - Close user list modal
- **Cmd/Ctrl + K** - Focus search (if implemented)

## Performance Monitoring

```bash
# Check bundle size
npm run build

# Analyze bundle
npm install -g @next/bundle-analyzer
ANALYZE=true npm run build
```

## Before Submission Checklist

```bash
# 1. Test all features
# See TESTING_GUIDE.md

# 2. Check for errors
npm run build

# 3. Clean up code
npm run lint

# 4. Update README
# Add any custom notes

# 5. Test deployment
vercel

# 6. Submit
# Push to GitHub
# Share Vercel URL
```

## Support Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Convex Docs**: https://docs.convex.dev
- **Clerk Docs**: https://clerk.com/docs
- **Tailwind Docs**: https://tailwindcss.com/docs

## Quick Links

- **Local App**: http://localhost:3000
- **Convex Dashboard**: Run `npx convex dashboard`
- **Clerk Dashboard**: https://dashboard.clerk.com
- **Vercel Dashboard**: https://vercel.com/dashboard

---

**Pro Tip**: Keep both terminals visible side by side to monitor logs from both Convex and Next.js!
