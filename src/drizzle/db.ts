import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Create postgres connection
const connectionString =
  "postgresql://neondb_owner:npg_V3cCqm2ZugWy@ep-long-flower-a1yrha72-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const sql = postgres(connectionString);

// Create drizzle database instance
export const db = drizzle(sql);
