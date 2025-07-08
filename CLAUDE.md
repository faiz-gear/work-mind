# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint

# Database
npx prisma generate    # Generate Prisma client
npx prisma db push     # Push schema changes to database
npx prisma studio      # Open Prisma Studio GUI
```

## Architecture Overview

WorkMind follows a clean 3-layer architecture with clear separation of concerns:

**Repository Layer** → **Service Layer** → **API Layer** → **Frontend Layer**

### Repository Layer (`src/lib/repositories/`)

- Extends `BaseRepository` with common CRUD operations
- Type-safe implementations for Task, Project, and Tag entities
- Handles database relations and pagination
- Pattern: `entity.repository.ts` with methods like `findMany()`, `create()`, `update()`, `delete()`

### Service Layer (`src/lib/services/`)

- Business logic and validation
- User permission checks and input sanitization
- Automatic time tracking for tasks
- Error handling and data transformation
- Pattern: `entity.service.ts` extending `BaseService`

### API Layer (`src/app/api/`)

- Next.js App Router API routes
- Consistent response format using `lib/api/response.ts`
- RESTful structure: `/api/tasks/[id]`, `/api/projects/[id]`
- Comprehensive error handling with Prisma error mapping

### Frontend Layer (`src/app/`, `src/hooks/`, `src/contexts/`)

- React Query for data fetching and caching
- Custom hooks pattern: `useEntity()` for each data type
- Centralized query keys in `src/lib/query/keys.ts`
- UserContext for global state management

## Data Models (Prisma Schema)

Core entities: **User** → **Project** → **Task** → **Tag**

```prisma
User (id, name, email, avatar)
↓ (1:many)
Project (id, name, description, color, userId)
↓ (1:many)
Task (id, title, description, status, priority, projectId, userId)
↓ (many:many)
Tag (id, name, color, userId)
```

**Status Enum**: TODO, IN_PROGRESS, COMPLETED, CANCELLED
**Priority Enum**: LOW, MEDIUM, HIGH, URGENT

## React Query Implementation

### Query Configuration

- **Stale Time**: 5 minutes
- **Cache Time**: 30 minutes
- **Retry**: 3 attempts with exponential backoff

### Patterns

```typescript
// Query keys (centralized in src/lib/query/keys.ts)
export const QUERY_KEYS = {
    TASKS: 'tasks',
    PROJECTS: 'projects',
    // ...
}

// Custom hooks pattern
export function useTasks() {
    return useQuery({
        queryKey: [QUERY_KEYS.TASKS],
        queryFn: () => fetch('/api/tasks').then(res => res.json())
    })
}
```

## AI Integration

### AI Services (`src/app/api/ai/`)

- **Chat**: `/api/ai/chat` - Interactive conversations
- **Suggestions**: `/api/ai/suggestions` - Task suggestions based on context
- **Summary**: `/api/ai/summary` - Work summaries and insights

### Implementation

- Uses Vercel AI SDK with OpenAI GPT-3.5-turbo
- Streaming responses for real-time interaction
- Context-aware prompts using user's task history
- Error handling for AI service failures

## Internationalization

### Setup

- **Default locale**: Chinese (zh)
- **Supported locales**: Chinese (zh), English (en)
- **Message files**: `messages/zh.json`, `messages/en.json`

### Usage Pattern

```typescript
import {useTranslations} from 'next-intl';

const t = useTranslations('Tasks');
return <h1>{t('title'
)
}
</h1>;
```

## Development Patterns

### Error Handling

- Use `handleApiError()` from `lib/api/response.ts` for consistent error responses
- Prisma errors are automatically mapped to appropriate HTTP status codes
- Frontend uses React Query's error states for user feedback

### Time Tracking

- Tasks automatically track `createdAt`, `updatedAt`, `startedAt`, `completedAt`
- Services handle status transitions and time updates
- Frontend displays relative times and durations

### User Context

- Mock user system with hardcoded user ID: `"user-mock-123"`
- All operations are scoped to the current user
- Ready for authentication integration

### Code Organization

- Group related functionality in feature folders
- Use TypeScript strict mode with proper type definitions
- Follow Next.js App Router conventions
- Keep API routes thin - business logic belongs in services

## Code Generation Rules

The `instructions/` directory contains comprehensive LangGPT-style code generation rules:

### Available Generation Rules

1. **`generate-biz-component.md`** - Business component generation
   - Generates: `index.ts`, `interface.ts`, `[Component].tsx`, `[Component].stories.tsx`
   - Follows React 19 patterns with TypeScript and Storybook integration
   - Includes daisyUI styling and accessibility standards

2. **`generate-model-repository.md`** - Data layer generation
   - **CRITICAL**: Always analyzes existing Prisma schema first (Step 0)
   - Generates repository implementations extending `BaseRepository`
   - Includes migration guidance and type safety validation
   - Follows Three-Layer Architecture pattern

3. **`generate-api-service.md`** - API and service layer generation
   - Generates RESTful API routes and service implementations
   - Includes Zod validation schemas and error handling
   - Follows existing patterns for user authorization and data scoping

4. **`generate-page-component.md`** - Page component generation
   - Implements Three-Layer Data Architecture (Server → React Query → UI)
   - Includes optimistic updates with rollback mechanisms
   - Configures React Query with proper caching and invalidation

### Usage Pattern

When generating code, reference the appropriate rule file for:
- Consistent naming conventions
- Proper TypeScript patterns
- Integration with existing architecture
- Quality assurance standards

## Current Implementation Status

### ✅ Complete

- Backend architecture (Repository, Service, API layers)
- Database schema and migrations
- AI integration endpoints
- React Query setup and custom hooks
- Internationalization configuration
- Error handling and response formatting
- Code generation rules and patterns

### 🚧 In Progress

- Frontend component implementation
- Authentication system integration
- UI/UX implementation with daisyUI components

### Extension Points

- Add new entities by following the Repository → Service → API → Hook pattern
- Use generation rules in `instructions/` for consistent code patterns
- Extend AI capabilities by adding new endpoints in `/api/ai/`
- Add new languages by creating message files and updating routing configuration
- Implement real authentication by replacing mock user system