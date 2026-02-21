# Testing Guide - Live Chat App

## Quick Start Testing

### Prerequisites
1. Open two different browsers (e.g., Chrome and Firefox) OR
2. Use one normal window and one incognito window

### Test Scenario: Two Users Chatting

## Step-by-Step Testing

### 1. Authentication ✅
**Browser 1:**
- [ ] Open http://localhost:3000
- [ ] Click "Sign In"
- [ ] Sign up with email (user1@test.com) or Google
- [ ] Verify you see your name and avatar in the sidebar

**Browser 2:**
- [ ] Open http://localhost:3000 in incognito/different browser
- [ ] Sign up with different email (user2@test.com)
- [ ] Verify you see your name and avatar

### 2. User List & Search ✅
**Browser 1:**
- [ ] Click the "+" button in the sidebar
- [ ] Verify you see User 2 in the list
- [ ] Type User 2's name in the search box
- [ ] Verify search filters correctly
- [ ] Type a random name - verify "No users found" appears

### 3. Start Conversation ✅
**Browser 1:**
- [ ] Click on User 2 from the user list
- [ ] Verify chat area opens with User 2's name in header
- [ ] Verify empty state message: "No messages yet"

### 4. Send Messages ✅
**Browser 1:**
- [ ] Type "Hello!" and click Send
- [ ] Verify message appears on the right (blue background)
- [ ] Verify timestamp shows (e.g., "2:34 PM")

**Browser 2:**
- [ ] Verify conversation with User 1 appears in sidebar automatically
- [ ] Click on the conversation
- [ ] Verify "Hello!" message appears on the left (gray background)
- [ ] Reply with "Hi there!"

**Browser 1:**
- [ ] Verify reply appears instantly (real-time)

### 5. Message Timestamps ✅
**Either Browser:**
- [ ] Send a message now - verify it shows time only (e.g., "2:34 PM")
- [ ] Check the timestamp format is correct

To test other formats, you can:
- Modify a message's `createdAt` in Convex dashboard to yesterday
- Verify it shows "Feb 15, 2:34 PM"

### 6. Empty States ✅
**Browser 1:**
- [ ] Click "+" to open user list
- [ ] Search for "xyz123" - verify "No users found"
- [ ] Close modal and click on sidebar empty area
- [ ] Verify "No conversation selected" in chat area

**New Browser (Browser 3):**
- [ ] Sign up as User 3
- [ ] Verify sidebar shows "No conversations yet"

### 7. Online/Offline Status ✅
**Browser 1 & 2 (both open):**
- [ ] In Browser 1, look at User 2 in the conversation
- [ ] Verify green dot appears next to User 2's avatar
- [ ] Verify "Online" text appears below name

**Browser 2:**
- [ ] Close the tab or browser
- [ ] Wait 2-3 seconds

**Browser 1:**
- [ ] Verify green dot disappears from User 2
- [ ] Verify "Online" text disappears

**Browser 2:**
- [ ] Reopen and sign in
- [ ] Verify green dot reappears in Browser 1

### 8. Typing Indicator ✅
**Browser 1:**
- [ ] Click in the message input box
- [ ] Start typing (don't send)

**Browser 2:**
- [ ] Verify you see animated dots (typing indicator)
- [ ] Verify it appears at the bottom of messages

**Browser 1:**
- [ ] Stop typing for 2 seconds

**Browser 2:**
- [ ] Verify typing indicator disappears

**Browser 1:**
- [ ] Type and immediately click Send

**Browser 2:**
- [ ] Verify typing indicator disappears when message arrives

### 9. Unread Message Count ✅
**Browser 1:**
- [ ] Send 3 messages to User 2
- [ ] Don't open the conversation in Browser 2 yet

**Browser 2:**
- [ ] Look at the sidebar
- [ ] Verify blue badge shows "3" next to User 1's conversation
- [ ] Click on the conversation
- [ ] Verify badge disappears immediately

**Browser 1:**
- [ ] Send another message

**Browser 2:**
- [ ] If you're still in the conversation, verify no badge appears
- [ ] Click back to sidebar (mobile) or just look at sidebar (desktop)
- [ ] Badge should stay at 0 since you're viewing the conversation

### 10. Smart Auto-Scroll ✅
**Browser 1:**
- [ ] Send 20+ messages to create a long chat history
- [ ] Scroll up to the top of the messages

**Browser 2:**
- [ ] Send a new message

**Browser 1:**
- [ ] Verify you stay scrolled up (don't auto-scroll)
- [ ] Verify a blue "↓" button appears at the bottom right
- [ ] Click the "↓" button
- [ ] Verify you scroll to the latest message
- [ ] Verify button disappears

**Browser 1:**
- [ ] Scroll to the bottom manually

**Browser 2:**
- [ ] Send another message

**Browser 1:**
- [ ] Verify you auto-scroll to the new message
- [ ] Verify no "↓" button appears

### 11. Responsive Layout ✅
**Desktop (Browser 1):**
- [ ] Verify sidebar and chat area are side by side
- [ ] Verify sidebar is ~320px wide
- [ ] Verify chat area takes remaining space

**Mobile (resize Browser 1 to < 768px width):**
- [ ] Verify only sidebar is visible
- [ ] Click on a conversation
- [ ] Verify chat area goes full screen
- [ ] Verify back arrow appears in chat header
- [ ] Click back arrow
- [ ] Verify you return to conversation list

### 12. Conversation Preview ✅
**Browser 1:**
- [ ] Send "This is the latest message"

**Browser 2:**
- [ ] Look at the sidebar (don't open the conversation)
- [ ] Verify the conversation shows:
  - User 1's name
  - Preview: "This is the latest message"
  - Timestamp of the message
  - Unread badge (if not opened)

### 13. Multiple Conversations ✅
**Browser 3 (new user):**
- [ ] Sign up as User 3
- [ ] Start a conversation with User 1

**Browser 1:**
- [ ] Verify you now have 2 conversations in sidebar
- [ ] Send a message to User 3
- [ ] Verify User 3's conversation moves to the top
- [ ] Send a message to User 2
- [ ] Verify User 2's conversation moves to the top

## Performance Tests

### Real-Time Latency
- [ ] Send a message in Browser 1
- [ ] Time how long it takes to appear in Browser 2
- [ ] Should be < 1 second

### Typing Indicator Latency
- [ ] Start typing in Browser 1
- [ ] Verify indicator appears in Browser 2 within 1 second
- [ ] Stop typing
- [ ] Verify indicator disappears within 2-3 seconds

### Online Status Update
- [ ] Close Browser 2
- [ ] Verify status updates in Browser 1 within 3-5 seconds

## Edge Cases

### Empty Search
- [ ] Open user list
- [ ] Leave search box empty
- [ ] Verify all users are shown

### Long Messages
- [ ] Send a message with 500+ characters
- [ ] Verify it wraps correctly in the bubble
- [ ] Verify it doesn't break the layout

### Special Characters
- [ ] Send messages with emojis: "Hello 👋 😊"
- [ ] Send messages with special chars: "Test @#$%^&*()"
- [ ] Verify they display correctly

### Rapid Messages
- [ ] Send 10 messages quickly (one after another)
- [ ] Verify all appear in correct order
- [ ] Verify timestamps are correct
- [ ] Verify auto-scroll works

### Network Issues
- [ ] Open DevTools → Network tab
- [ ] Set throttling to "Slow 3G"
- [ ] Send messages
- [ ] Verify they still work (may be slower)

## Checklist Summary

- [ ] All 10 main features tested
- [ ] Responsive design works on mobile and desktop
- [ ] Real-time updates work correctly
- [ ] No console errors
- [ ] All empty states display properly
- [ ] Timestamps format correctly
- [ ] Online status updates in real-time
- [ ] Typing indicators work smoothly
- [ ] Unread counts are accurate
- [ ] Smart scroll works as expected

## Common Issues & Solutions

**Messages not appearing in real-time:**
- Check that `npx convex dev` is running
- Refresh both browsers
- Check browser console for errors

**Typing indicator not showing:**
- Verify you're typing in the input box
- Check that both users are in the same conversation
- Wait 1-2 seconds for the indicator to appear

**Online status not updating:**
- Close and reopen the browser tab
- Check that the user is actually signed in
- Verify `updateOnlineStatus` is being called

**Unread count not clearing:**
- Make sure you actually opened the conversation
- Check that `markMessagesAsRead` is being called
- Refresh the page

## Success Criteria

✅ All features work as described
✅ No errors in browser console
✅ Real-time updates are instant
✅ UI is responsive and looks good
✅ Empty states are helpful
✅ App works on mobile and desktop

---

**Ready for submission!** 🎉

If all tests pass, your app is complete and ready to submit for your February 24 deadline.
