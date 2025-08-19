/**
 * Application constants
 */

// App metadata
export const APP_NAME = 'Work Mind'
export const APP_DESCRIPTION = 'AI-powered work logging and analysis platform'

// API routes
export const API_ROUTES = {
  AUTH: '/api/auth',
  USERS: '/api/users',
  WORK_RECORDS: '/api/work-records',
  TAGS: '/api/tags',
  SUMMARIES: '/api/summaries',
  AI_SERVICES: '/api/ai-services',
  ANALYTICS: '/api/analytics',
  EXPORTS: '/api/exports',
} as const

// Database constants
export const DB_TABLES = {
  USERS: 'users',
  WORK_RECORDS: 'work_records',
  TAGS: 'tags',
  SUMMARIES: 'summaries',
  AI_SERVICES: 'ai_services',
  PROMPT_TEMPLATES: 'prompt_templates',
  EXPORTS: 'exports',
} as const

// UI constants
export const SIZES = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
} as const

// Default values
export const DEFAULTS = {
  PAGE_SIZE: 20,
  DEBOUNCE_MS: 300,
  TIMEOUT_MS: 5000,
} as const
