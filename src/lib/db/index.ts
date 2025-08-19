import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { databaseConfig } from '../config'
import * as schema from './schema'

/**
 * Database connection and Drizzle ORM setup
 * Uses PostgreSQL with Supabase
 */

// Create the postgres client
const client = postgres(databaseConfig.url, { prepare: false })

// Create the drizzle instance
export const db = drizzle(client, { schema })

// Export the client for direct access if needed
export { client as postgresClient }

// Export schema for use in other parts of the application
export * from './schema'
