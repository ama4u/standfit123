// Storage layer - automatically selects SQLite or PostgreSQL based on environment
import { IStorage } from "./storage-postgres";

// Use PostgreSQL in production if DATABASE_URL is available, otherwise SQLite
const databaseUrl = process.env.DATABASE_URL;

let storage: IStorage;

if (databaseUrl && process.env.NODE_ENV === 'production') {
  console.log('🐘 Using PostgreSQL storage');
  const { PostgreSQLStorage } = await import("./storage-postgres.js");
  storage = new PostgreSQLStorage();
} else {
  console.log('🗃️  Using SQLite storage');
  const { DatabaseStorage } = await import("./storage-sqlite.js");
  storage = new DatabaseStorage();
}

export { storage };
export type { IStorage };