import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import * as zod from "zod";

export const roles = pgTable("roles", {
  id: serial("id").primaryKey().unique(),
  name: varchar("title", { length: 255 }).notNull(),
});

export const RoleSchema = createSelectSchema(roles);
export const NewRoleSchema = createInsertSchema(roles).pick({
  name: true,
});

export type TRole = zod.infer<typeof RoleSchema>;
export type TNewRole = zod.infer<typeof NewRoleSchema>;
