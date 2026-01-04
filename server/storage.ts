// Storage factory that chooses between SQLite and PostgreSQL
import { storage as sqliteStorage } from "./storage-sqlite";
import { PostgreSQLStorage } from "./storage-postgres";

// Use appropriate storage based on environment
const databaseUrl = process.env.DATABASE_URL;
const usePostgres = databaseUrl && process.env.NODE_ENV === 'production';

export const storage = usePostgres 
  ? new PostgreSQLStorage() 
  : sqliteStorage;

console.log(`📊 Using ${usePostgres ? 'PostgreSQL' : 'SQLite'} storage`);