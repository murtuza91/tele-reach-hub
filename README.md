# TeleReach Hub - Telegram Outreach Manager

A modern web application built with Next.js for managing multiple Telegram accounts and automating outreach campaigns.

## Features

- **Multi-Account Management**: Connect and manage multiple Telegram accounts simultaneously
- **Campaign Management**: Create, run, pause, and monitor outreach campaigns
- **Template System**: Create reusable message templates with placeholder support
- **AI Prompts**: Use AI prompts to enhance your outreach copy
- **Rate Limiting**: Per-account daily limits and delays between messages
- **Quiet Hours**: Respect recipient time zones with configurable quiet hours
- **Real-time Dashboard**: Monitor sends, failures, and campaign progress
- **Optimistic Updates**: Instant UI updates with automatic rollback on failure

## Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **State Management**: Redux Toolkit with localStorage persistence
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Form Handling**: React Hook Form with Zod validation
- **TypeScript**: Full type safety throughout the application

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, or pnpm

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd tele-reach-hub
```

2. Install dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
tele-reach-hub/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── (authenticated)/   # Protected routes
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home/login page
│   │   ├── providers.tsx      # Redux & React Query providers
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── accounts/          # Account management components
│   │   ├── campaigns/         # Campaign management components
│   │   ├── dashboard/         # Dashboard components
│   │   ├── templates/         # Template & prompt components
│   │   └── ui/                # shadcn/ui components
│   ├── store/                 # Redux store
│   │   ├── slices/           # Redux slices
│   │   ├── middleware/       # Custom middleware
│   │   ├── queueProcessor.ts # Campaign queue processor
│   │   ├── store.ts          # Store configuration
│   │   └── hooks.ts          # Typed Redux hooks
│   ├── pages/                # Page components
│   ├── lib/                  # Utilities and mock data
│   └── types/                # TypeScript types
├── public/                   # Static assets
├── next.config.js           # Next.js configuration
├── tailwind.config.ts       # Tailwind configuration
└── tsconfig.json           # TypeScript configuration
```

## Key Decisions & Trade-offs

### State Management

**Decision**: Redux Toolkit over Context API
- **Rationale**: Better performance with large state trees, middleware support for localStorage sync, time-travel debugging
- **Trade-off**: More boilerplate but better scalability and testability

### Data Persistence

**Decision**: localStorage with Redux middleware
- **Rationale**: Simple setup, no backend required, instant persistence
- **Trade-off**: Limited to 5-10MB, synchronous operations, no cross-device sync

### Queue Processing

**Decision**: Client-side interval-based processing
- **Rationale**: Simple implementation, no backend infrastructure needed
- **Trade-off**: Stops when browser closes, less reliable than server-side processing

### UI Framework

**Decision**: shadcn/ui + Tailwind CSS
- **Rationale**: Highly customizable, production-ready components, excellent DX
- **Trade-off**: Larger initial setup but better long-term maintainability

### Form Handling

**Decision**: React Hook Form + Zod
- **Rationale**: Type-safe validation, excellent performance, minimal re-renders
- **Trade-off**: Learning curve for Zod schema definitions

## Features in Detail

### Account Management
- Connect multiple Telegram accounts
- Configure per-account settings (daily limits, delays, quiet hours)
- Monitor account status and usage in real-time

### Campaign Management
- Create campaigns with custom templates and AI prompts
- Select specific accounts for each campaign
- Control campaign state (draft, running, paused, completed)
- Manual "send now" with optimistic updates and error rollback

### Templates & Prompts
- Create reusable message templates with placeholders
- AI prompts to enhance message personalization
- Set default templates and prompts

### Dashboard
- Real-time statistics (messages today/week/month)
- Account performance charts
- Campaign progress tracking
- Recent activity feed

## Testing

Basic unit tests are included for core logic:

```bash
npm run test
```

## Mock API

The application uses a mock API with seeded data:
- 3 Telegram accounts (2 connected, 1 rate-limited)
- 3 message templates
- 2 AI prompts
- 2 campaigns (1 running, 1 paused)
- 50 simulated messages

## Behavior Rules

Messages can only be sent when:
1. Account is connected
2. Account is under daily limit
3. Sufficient delay has passed since last send
4. Outside of quiet hours (if enabled)
5. Campaign is running

## Future Enhancements

- Backend API integration with real Telegram Bot API
- Database persistence (PostgreSQL/MongoDB)
- User authentication with sessions
- Webhook support for delivery confirmations
- Advanced analytics and reporting
- A/B testing for templates
- Contact list management
- Reply tracking and conversation threads

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
