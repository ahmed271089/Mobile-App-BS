# Best Solving — Mobile App (Expo / React Native)

Matches the provided dark/violet UI design: Home feed, auth, post-creation flow with AI
assist, solved library, and profile.

## What's built
- **Theme** (`src/theme`) — colors, typography, spacing tokens extracted from the design
- **API layer** (`src/api`) — `client.ts` (fetch wrapper with JWT auth header + auto-refresh on 401),
  `auth.ts` (login/register/logout), `chat.ts` (conversations, messages, friend requests),
  `socket.ts` (shared Socket.io connection via React context), `tokenStorage.ts` (AsyncStorage)
- **Auth** — Login, Register wired to the real backend (`POST /api/auth/login` / `/register`)
- **Chat** — Conversations list + chat thread screen, wired to both REST (history) and the
  socket (`send_message` / `new_message` / `typing` events). New chat tab in the bottom nav.
- **Home** — trending problems feed, recent solutions, category chips, search (still mock data)
- **Create Post flow** (modal, 3 steps) — choose Problem/Solution → problem definition + category →
  AI Agent "Generate Suggestions" → finalize sharing (still mock data — not yet POSTing to `/api/posts`)
- **Library** — solved-library stats grid + recently solved list (mock data)
- **Profile** — reputation, stats, real logout (clears tokens + disconnects socket)
- **Post Detail** — full post, AI diagnosis box, comments, "Mark as Solved" action (mock data)
- **Navigation** — root stack (Auth ⇄ MainTabs ⇄ CreatePostStack modal), custom bottom tab bar
  with a raised gradient "+" button in the center

## Connecting to the backend
Edit `src/api/config.ts`:
- `RUNNING_ON`: `'simulator'` (default) or `'device'` for a physical phone via Expo Go
- `LAN_IP`: your computer's LAN IP, only used when `RUNNING_ON = 'device'`

That's the only place the backend address lives. Everything else (`client.ts`, `socket.ts`)
reads from it.

**Still using mock data** (`src/data/mockData.ts`) — Home feed, Create Post, Library, and Post
Detail haven't been switched over to real API calls yet. Each has a `// TODO` where the swap
goes once you're ready.

## Not yet built
- Friend request UI screens (the API calls exist in `src/api/chat.ts`, no screens yet)
- Notifications screen
- Admin/report screens (those belong in the separate `backoffice` repo, not here)
- Actual photo/video capture wiring (`expo-image-picker` is installed but not yet hooked up
  in `ProblemDefinitionScreen`)

## Setup

```bash
npm install
npx expo install --fix   # double-check native module versions match your Expo SDK
npx expo start
```

Then press `i` for iOS simulator, `a` for Android emulator, or scan the QR code with the
Expo Go app on your phone (after setting `RUNNING_ON = 'device'` in `src/api/config.ts`).

Make sure the backend is running first (`npm run start:dev` in the `backend` repo) — Login
and Register will fail with a network error otherwise.
