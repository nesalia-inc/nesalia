import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq, and, or, isNull, asc, gt, ilike, inArray } from "drizzle-orm";
import * as schema from "./schema";

let pool: Pool | null = null;
let drizzleInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
    pool.on('error', (err) => {
      console.error('Unexpected error on idle pg client', err);
    });
  }
  return pool;
}

function getDb() {
  if (!drizzleInstance) {
    drizzleInstance = drizzle({ client: getPool(), schema });
  }
  return drizzleInstance;
}

// Lazy singleton — pool created on first use, not at module import
export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_target, prop) {
    return getDb()[prop as keyof typeof drizzleInstance];
  },
});

// Re-export helpers from same drizzle instance for type compatibility
export { eq, and, or, isNull, asc, gt, ilike, inArray };

export * from "./schema";