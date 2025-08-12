import "dotenv";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/drizzle/schema",
  out: "./src/drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    // url: `postgresql://postgres:123456@127.0.0.1:5432/store_management_v1`,
    url: "postgresql://neondb_owner:npg_V3cCqm2ZugWy@ep-long-flower-a1yrha72-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  },
  schemaFilter: ["public"],
  tablesFilter: ["public.*"],
  verbose: true,
  strict: true,
});
