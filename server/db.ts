import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { drizzle as drizzlePostgres } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";
import * as schemaPostgres from "@shared/schema-postgres";

// Use PostgreSQL in production if DATABASE_URL is available, otherwise SQLite
const databaseUrl = process.env.DATABASE_URL;

let db: any;

if (databaseUrl && process.env.NODE_ENV === 'production') {
  // PostgreSQL for production
  console.log('🐘 Using PostgreSQL database');
  const client = postgres(databaseUrl, {
    ssl: { rejectUnauthorized: false },
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  });
  db = drizzlePostgres(client, { schema: schemaPostgres });
} else {
  // SQLite for development
  console.log('🗃️  Using SQLite database');
  const sqlite = new Database('./sqlite.db');
  db = drizzle(sqlite, { schema });
}

export { db };
