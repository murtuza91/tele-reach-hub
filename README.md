# TeleReach Hub 📱

A modern, full-featured Telegram outreach management platform built with Next.js, TypeScript, and Redux. Manage multiple Telegram accounts, automate campaigns, and track your outreach performance all in one place.

![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18.3.1-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?style=flat-square&logo=typescript)
![Redux](https://img.shields.io/badge/Redux-9.2.0-purple?style=flat-square&logo=redux)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ Features

### 📊 Dashboard
- Real-time performance metrics and analytics
- Interactive charts showing send volume trends
- Account performance comparison
- Campaign progress tracking
- Quick stats overview (daily, weekly, monthly sends)

### 👥 Account Management
- Manage multiple Telegram accounts
- Real-time connection status monitoring
- Rate limiting and quota management
- Custom delay settings per account
- Account-specific template and prompt assignments
- Daily send limits with visual progress tracking

### 🎯 Campaign Management
- Create and manage outreach campaigns
- Multiple campaign statuses (draft, running, paused, completed, cancelled)
- Assign multiple accounts to campaigns
- Target count and progress tracking
- Success/failure rate monitoring
- Campaign scheduling and automation

### 📝 Message Templates
- Create reusable message templates
- Set active/default templates
- Template version control
- Quick template switching per account
- Rich text message composition

### 🤖 AI Prompts
- Custom AI prompt management
- System prompts for message personalization
- Prompt activation per account
- AI-powered message generation capabilities

### ⚡ Message Queue Processing
- Automated message queue system
- Smart rate limiting
- Retry logic for failed messages
- Priority-based message scheduling
- Real-time status updates

## 🛠️ Tech Stack

### Core Framework
- **Next.js 15.5.4** - React framework with App Router
- **React 18.3.1** - UI library
- **TypeScript 5.8.3** - Type safety

### State Management
- **Redux Toolkit 2.9.0** - Centralized state management
- **React Redux 9.2.0** - React bindings for Redux
- **Redux Persist 6.0.0** - State persistence in localStorage

### UI Components
- **shadcn/ui** - High-quality, accessible component library
- **Radix UI** - Unstyled, accessible component primitives
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Recharts 2.15.4** - Charting library for data visualization

### Forms & Validation
- **React Hook Form 7.61.1** - Performant form management
- **Zod 3.25.76** - TypeScript-first schema validation
- **@hookform/resolvers** - Validation resolvers for React Hook Form

### Additional Libraries
- **TanStack Query 5.83.0** - Data fetching and caching
- **date-fns 3.6.0** - Date manipulation
- **Sonner 1.7.4** - Toast notifications
- **clsx & tailwind-merge** - Conditional className utilities

### Development Tools
- **ESLint** - Code linting
- **Vitest** - Unit testing
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📁 Project Structure

```
tele-reach-hub/
├── public/                      # Static assets
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
│
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── (authenticated)/    # Protected routes
│   │   │   ├── accounts/       # Accounts page
│   │   │   ├── campaigns/      # Campaigns page
│   │   │   ├── dashboard/      # Dashboard page
│   │   │   ├── templates/      # Templates page
│   │   │   └── layout.tsx      # Authenticated layout
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   └── providers.tsx       # App providers (Redux, React Query)
│   │
│   ├── components/              # React components
│   │   ├── accounts/           # Account-specific components
│   │   ├── campaigns/          # Campaign-specific components
│   │   ├── dashboard/          # Dashboard components
│   │   ├── templates/          # Template components
│   │   ├── ui/                 # shadcn/ui components
│   │   └── AppSidebar.tsx      # Main navigation sidebar
│   │
│   ├── contexts/                # React contexts (if needed)
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── use-mobile.tsx      # Mobile detection hook
│   │   └── use-toast.ts        # Toast notification hook
│   │
│   ├── lib/                     # Utility functions
│   │   ├── mockData.ts         # Mock data for development
│   │   ├── rules.ts            # Business logic rules
│   │   ├── rules.test.ts       # Unit tests for rules
│   │   └── utils.ts            # Helper utilities
│   │
│   ├── store/                   # Redux store
│   │   ├── middleware/         # Redux middleware
│   │   │   └── localStorageMiddleware.ts
│   │   ├── slices/             # Redux slices
│   │   │   ├── accountsSlice.ts
│   │   │   ├── authSlice.ts
│   │   │   ├── campaignsSlice.ts
│   │   │   ├── messagesSlice.ts
│   │   │   ├── promptsSlice.ts
│   │   │   └── templatesSlice.ts
│   │   ├── hooks.ts            # Typed Redux hooks
│   │   ├── queueProcessor.ts   # Message queue processor
│   │   └── store.ts            # Store configuration
│   │
│   ├── types/                   # TypeScript type definitions
│   │   └── index.ts
│   │
│   └── views/                   # Page view components
│       ├── Accounts.tsx
│       ├── Campaigns.tsx
│       ├── Dashboard.tsx
│       ├── Index.tsx
│       └── Templates.tsx
│
├── .next/                       # Next.js build output (generated)
├── node_modules/                # Dependencies (generated)
│
├── components.json              # shadcn/ui configuration
├── eslint.config.js            # ESLint configuration
├── next.config.mjs             # Next.js configuration
├── next-env.d.ts               # Next.js TypeScript definitions
├── package.json                # Dependencies and scripts
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── yarn.lock                   # Yarn lock file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **Yarn** 1.22.x or **npm** 8.x or higher
- A modern web browser

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/tele-reach-hub.git
cd tele-reach-hub
```

2. **Install dependencies**

```bash
yarn install
# or
npm install
```

3. **Start the development server**

```bash
yarn dev
# or
npm run dev
```

4. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

### First Run

On your first visit, you'll see the sign-in page. For development:
- Click the "Auto-fill" button to populate demo credentials
- Click "Continue" to access the application
- The authentication state persists in localStorage

## 📜 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **dev** | `yarn dev` | Start development server at localhost:3000 |
| **build** | `yarn build` | Build production-ready application |
| **start** | `yarn start` | Start production server |
| **lint** | `yarn lint` | Run ESLint for code quality checks |
| **test** | `yarn test` | Run unit tests with Vitest |

## 🏗️ Building for Production

### Create Production Build

```bash
yarn build
```

This will:
1. Compile TypeScript
2. Optimize and bundle code
3. Generate static pages where possible
4. Output to `.next/` directory

### Start Production Server

```bash
yarn start
```

The production server will start on port 3000 by default.

### Build Output

The build process generates:
- **Static pages** for routes that don't require dynamic data
- **Server-side rendered pages** for dynamic routes
- **Optimized JavaScript bundles** with code splitting
- **CSS bundles** with Tailwind optimizations

## 🔑 Core Concepts

### State Management

The application uses **Redux Toolkit** for centralized state management with the following slices:

#### Auth Slice
Manages user authentication state:
- User login/logout
- Authentication status
- User profile data
- Persisted to localStorage

#### Accounts Slice
Manages Telegram accounts:
- Account list (CRUD operations)
- Connection status
- Rate limiting settings
- Daily send quotas
- Account-specific configurations

#### Campaigns Slice
Manages outreach campaigns:
- Campaign creation and management
- Status tracking (draft, running, paused, etc.)
- Target and progress metrics
- Account assignments

#### Templates Slice
Manages message templates:
- Template CRUD operations
- Active/default template settings
- Template assignments to accounts

#### Prompts Slice
Manages AI prompts:
- Prompt CRUD operations
- System prompt configurations
- Prompt activation per account

#### Messages Slice
Manages outreach messages:
- Message queue
- Send status tracking
- Error handling
- Message history

### Message Queue Processor

The queue processor (`src/store/queueProcessor.ts`) handles:
- **Automated message sending** - Processes queued messages
- **Rate limiting** - Respects account-specific limits
- **Retry logic** - Handles failed sends with exponential backoff
- **Status updates** - Real-time message status changes
- **Scheduling** - Time-based message delivery

The processor starts automatically when the app loads and runs in the background.

### Local Storage Middleware

All Redux state is automatically persisted to localStorage:
- **Key prefix**: `trh_` (TeleReach Hub)
- **Selective persistence**: Only necessary data is stored
- **Hydration**: State reloads on app restart
- **SSR-safe**: Checks for `window` availability

### Component Structure

#### View Components (`src/views/`)
Page-level components containing business logic and data fetching

#### UI Components (`src/components/ui/`)
Reusable, styled components from shadcn/ui

#### Feature Components (`src/components/[feature]/`)
Feature-specific components (dialogs, forms, cards)

## 🎨 Styling

### Tailwind CSS

The project uses Tailwind CSS with custom configuration:
- **Custom color palette** via CSS variables
- **Dark mode support** (system preference)
- **Responsive breakpoints** for all screen sizes
- **Custom animations** via tailwindcss-animate

### shadcn/ui Components

Pre-built, accessible components that can be customized:
- Located in `src/components/ui/`
- Based on Radix UI primitives
- Fully typed with TypeScript
- Customizable via `components.json`

### Adding New UI Components

```bash
npx shadcn-ui@latest add [component-name]
```

## 🔧 Configuration Files

### next.config.mjs
Next.js configuration:
- React strict mode enabled
- Transpiles `lucide-react` for compatibility
- Can add environment variables, redirects, etc.

### tailwind.config.ts
Tailwind CSS configuration:
- Custom color scheme
- Dark mode settings
- Content paths for purging
- Plugins (animations, typography)

### tsconfig.json
TypeScript configuration:
- Path aliases (`@/*` → `src/*`)
- Strict type checking enabled
- Next.js plugin integration
- Module resolution strategy

## 🧪 Testing

The project uses **Vitest** for unit testing:

```bash
yarn test
```

Test files are located alongside source files with `.test.ts` or `.test.tsx` extensions.

### Example Test Structure

```typescript
// src/lib/rules.test.ts
import { describe, it, expect } from 'vitest';
import { someFunction } from './rules';

describe('Rules', () => {
  it('should do something', () => {
    expect(someFunction()).toBe(expectedValue);
  });
});
```

## 🔒 Authentication

Current implementation uses a simple localStorage-based authentication:
- **Demo mode** for development
- **State persistence** across sessions
- **Protected routes** via layout-level checks

### Production Recommendations

For production deployment, integrate:
- OAuth providers (Google, GitHub, etc.)
- JWT token-based authentication
- Secure HTTP-only cookies
- Backend API integration
- Role-based access control (RBAC)

## 🌐 API Integration

The application is currently set up for frontend-only operation with mock data. To integrate with a real backend:

1. **Update the Redux slices** to use async thunks
2. **Add API client** in `src/lib/api.ts`
3. **Configure TanStack Query** for data fetching
4. **Update environment variables** in `.env.local`
5. **Add authentication tokens** to API requests

### Example API Integration

```typescript
// src/lib/api.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('trh_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## 📱 Responsive Design

The application is fully responsive:
- **Mobile-first** approach
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Sidebar**: Collapsible on mobile, fixed on desktop
- **Tables**: Scrollable on small screens
- **Charts**: Responsive containers with proper scaling

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
2. **Import project** in Vercel dashboard
3. **Configure** build settings (auto-detected)
4. **Deploy** - Automatic deployments on push

### Other Platforms

The application can be deployed to any platform supporting Next.js:
- **Netlify**
- **Railway**
- **AWS Amplify**
- **DigitalOcean App Platform**
- **Self-hosted** with Docker

### Environment Variables

Create `.env.local` for local development:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://api.yourapp.com

# Feature Flags
NEXT_PUBLIC_ENABLE_AI_FEATURES=true

# Analytics (optional)
NEXT_PUBLIC_GA_TRACKING_ID=UA-XXXXXXXXX-X
```

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Code Style

- Use **TypeScript** for all new code
- Follow **ESLint** rules (`yarn lint`)
- Use **Prettier** for formatting (if configured)
- Write **tests** for new features
- Update **documentation** as needed

### Commit Messages

Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test changes
- `chore:` Build/config changes

## 📝 License

This project is private and proprietary. All rights reserved.

## 👨‍💻 Development Team

Built with ❤️ by the Codezila Projects team

## 🐛 Known Issues

- React Router is installed but not actively used (Next.js App Router is used instead)
- Some ESLint warnings about fast refresh (non-breaking)
- Mock data used for development - needs backend integration

## 🗺️ Roadmap

- [ ] Backend API integration
- [ ] Real Telegram API connection
- [ ] Advanced analytics and reporting
- [ ] Team collaboration features
- [ ] Webhook support
- [ ] Custom fields for templates
- [ ] A/B testing for campaigns
- [ ] Response tracking and conversation management
- [ ] Export data to CSV/Excel
- [ ] Multi-language support

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Happy Outreaching! 🚀**

