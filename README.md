# Work Mind

AI-powered work logging and analysis platform built with Next.js 14+ and modern web technologies.

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **UI Libraries**: Chakra UI 2.8+ and Tailwind CSS 4+
- **Database**: Supabase (PostgreSQL) with Drizzle ORM
- **Language**: TypeScript 5.0+
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (for production)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd work-mind
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
# Edit .env.local with your actual values
```

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Database Setup

When you have a Supabase database configured:

```bash
# Generate migrations
npm run db:generate

# Push schema to database
npm run db:push

# Open Drizzle Studio
npm run db:studio
```

## Project Structure

```
src/
├── app/                # Next.js App Router
│   ├── api/           # API routes
│   ├── globals.css    # Global styles
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Home page
├── components/         # React components
│   ├── ui/            # Basic UI components
│   ├── layout/        # Layout components
│   └── providers/     # React Providers
├── lib/               # Utility libraries
│   ├── db/            # Database related
│   ├── utils.ts       # Common utilities
│   └── constants.ts   # Constants
├── styles/            # Style files
│   └── theme.ts       # Theme configuration
└── types/             # TypeScript types
    ├── api.types.ts
    └── app.types.ts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate database migrations
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Drizzle Studio

## Development

This project follows TypeScript strict mode and uses unified 'sm' sizing across all UI components for consistency.
