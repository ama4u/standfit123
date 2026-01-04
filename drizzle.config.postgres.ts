import type { Config } from "drizzle-kit";

export default {
  schema: "./shared/schema-postgres.ts",
  out: "./drizzle-postgres",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  },
  verbose: true,
  strict: true,
} satisfies Config;