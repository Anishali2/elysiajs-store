import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import * as zod from "zod";

export const posts = pgTable("posts", {
  id: serial("id").primaryKey().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 500 }),
  content: text("content").notNull(),
  description: text("description").default(""),
  testing_field: text("testing_field").default(""),
  phone: text("phone").default(""),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export const PostSchema = createSelectSchema(posts);
export const NewPostSchema = createInsertSchema(posts).pick({
  title: true,
  subtitle: true,
  content: true,
  description: true,
});

export type TPost = zod.infer<typeof PostSchema>;
export type TNewPost = zod.infer<typeof NewPostSchema>;
