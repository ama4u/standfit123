import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema-postgres";

// Get database URL from environment
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is required for PostgreSQL storage');
}

// Create postgres client with proper SSL configuration
const client = postgres(databaseUrl, {
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 25, // Increased from 10 to handle more concurrent connections
  idle_timeout: 30, // Increased from 20 to prevent premature disconnections
  connect_timeout: 15, // Increased from 10 for better reliability
  retry: 3, // Add retry attempts for failed connections
});

// Create drizzle instance
const db = drizzle(client, { schema });

export { db, client };