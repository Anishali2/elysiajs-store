import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import * as zod from "zod";
export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  email: text("email"),
  phone: text("phone"),
  location: text("location"),
  description: text("description").notNull(),
  join_date: timestamp("join_date").defaultNow(),
});

export const AccountSchema = createSelectSchema(accounts);
export const NewAccountSchema = createInsertSchema(accounts).pick({
  title: true,
  subtitle: true,
  content: true,
  description: true,
});

export type TPost = zod.infer<typeof AccountSchema>;
export type TNewPost = zod.infer<typeof NewAccountSchema>;
