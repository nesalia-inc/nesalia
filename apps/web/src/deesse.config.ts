import { defineConfig } from 'deesse';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { schema } from './db/schema';

const client = postgres(process.env.DATABASE_URL!);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const config = defineConfig({
  name: "DeesseJS App",
  database: drizzle(client, { schema }) as any,
  secret: process.env.DEESSE_SECRET!,
  auth: {
    baseURL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  },
});