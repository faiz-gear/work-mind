/**
 * Application type definitions
 */

import { User } from '@/lib/db'

// Re-export database types
export type { User, NewUser } from '@/lib/db'

// Component prop types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

// Form types
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'textarea'
  required?: boolean
  placeholder?: string
}

// State management types
export interface AppState {
  user: User | null
  isLoading: boolean
  error: string | null
}

// Navigation types
export interface NavItem {
  label: string
  href: string
  icon?: React.ComponentType
}
