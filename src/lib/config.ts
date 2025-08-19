/**
 * Environment configuration module
 * Centralized access to environment variables with validation
 */

interface Config {
  database: {
    url: string
  }
  supabase: {
    url: string
    anonKey: string
    serviceRoleKey: string
  }
  app: {
    nextAuthSecret: string
    nextAuthUrl: string
  }
}

function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name] || defaultValue
  if (!value) {
    throw new Error(`Environment variable ${name} is required`)
  }
  return value
}

export const config: Config = {
  database: {
    url: getEnvVar('DATABASE_URL'),
  },
  supabase: {
    url: getEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
    anonKey: getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    serviceRoleKey: getEnvVar('SUPABASE_SERVICE_ROLE_KEY'),
  },
  app: {
    nextAuthSecret: getEnvVar('NEXTAUTH_SECRET'),
    nextAuthUrl: getEnvVar('NEXTAUTH_URL', 'http://localhost:3000'),
  },
}

// Export individual configs for convenience
export const databaseConfig = config.database
export const supabaseConfig = config.supabase
export const appConfig = config.app
