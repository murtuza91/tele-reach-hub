## Tele Reach Hub – Frontend Telegram Outreach Manager (Mock)

A small web app to automate and manage Telegram outreach across multiple accounts. This project uses a fully mocked datasource and scheduler to simulate campaigns, rate limiting, and message queues.

### Quick Start

1) Prerequisites
- Node 18+ and pnpm or npm

2) Install
```bash
pnpm install
# or
npm install
```

3) Run dev server
```bash
pnpm dev
# or
npm run dev
```

4) Tests
```bash
pnpm test
# or
npm test
```

### Tech Stack
- React + Vite + TypeScript
- TailwindCSS + shadcn/ui
- React Router
- TanStack Query (light footprint prepared)
- Recharts for charts
- Vitest for unit tests

### Core Features Implemented
- Mock sign-in screen; simple `AuthContext` with localStorage persistence
- Multi-account management with per-account settings drawer
- Templates and Prompts CRUD (activate, default, delete)
- Campaigns: create, start, pause, resume, cancel
- Message queue visualization with statuses (queued, sending, sent, failed)
- Manual “Send Now” with optimistic update and rollback
- Search and filters for campaigns and accounts
- Stats dashboard (KPI tiles, charts) that reflect mock data and queue progress
- Local persistence (accounts, templates, prompts, campaigns, messages) via localStorage

### Project Structure (selected)
- `src/contexts/AppContext.tsx`: In-memory store, persistence, and queue scheduler
- `src/contexts/AuthContext.tsx`: Mock auth state and persistence
- `src/pages/Index.tsx`: Sign-in and dashboard gate
- `src/pages/Accounts.tsx`: Accounts list, search, settings
- `src/pages/Templates.tsx`: Templates & Prompts tabs and dialogs
- `src/pages/Campaigns.tsx`: Campaign list, search/filter, controls, manual send
- `src/pages/Dashboard.tsx`: KPIs and charts
- `src/lib/mockData.ts`: Seed data
- `src/lib/rules.ts`: Pure behavior rules for can-send checks
- `src/lib/rules.test.ts`: Vitest unit tests

### Behavior Rules Simulated
A message can send only if:
- Account is Connected
- `sentToday < dailyLimit`
- Outside quiet hours (22:00–08:00) if enabled
- Respect `delaySeconds` since that account’s last send
- Campaign is Running

Enforcement occurs in a scheduler loop (1s tick) within `AppContext`, moving queued → sending → sent/failed, updating counters and timestamps. Manual “Send Now” follows the same rules and uses optimistic UI with rollback on failure.

### Decisions & Trade-offs
- Mocked Scheduler in FE: Implemented inside `AppContext` to keep everything client-side and observable. Trade-off: not suitable for real-time multi-user; perfect for demo.
- localStorage for Persistence: Simple and zero-dependency. Trade-off: no multi-device sync; clear browser storage to reset.
- Optimistic Updates: Manual send increments counters immediately, then rolls back on failure. Trade-off: short window where stats can temporarily overshoot.
- Minimal Global State: Avoided heavyweight state libs; React Context + local state is enough for this scale.
- Time & Simplicity over Completeness: Queue and stats focus on core behaviors; not every edge-case or metric is modeled.

### How to Use
1) Sign In on the landing page (mocked). You’ll be redirected to the dashboard.
2) Accounts: connect accounts, edit per-account settings (delay, daily limit, template/prompt, quiet hours).
3) Templates & Prompts: create, edit, set active/default.
4) Campaigns: create a campaign, then Start. Use Pause/Resume/Cancel. Use Send Now for a manual send respecting account rules.
5) Dashboard: observe KPIs and charts as messages process.

### Testing
- Run `npm test` or `pnpm test` to execute Vitest.
- Unit tests cover the can-send rules in `src/lib/rules.test.ts`.

### Known Limitations
- No backend or real Telegram integration.
- Single-user, single-tab expectation. Opening multiple tabs can cause race-y persistence updates.
- Quiet hours are based on the client’s local time.
- Charts are illustrative and based on snapshots, not full time-series aggregation.

### Future Improvements (Stretch)
- CSV import for contacts and better queue visualization with timelines per message.
- WebSocket mock for richer live updates.
- Real Telegram API integration and backend scheduler.

### Scripts
- `dev`: start Vite dev server
- `build`: production build
- `preview`: preview prod build
- `test`: run Vitest

### Resetting Data
Clear `localStorage` keys:
`trh_accounts`, `trh_templates`, `trh_prompts`, `trh_campaigns`, `trh_messages`, `trh_authed`, `trh_user`.
