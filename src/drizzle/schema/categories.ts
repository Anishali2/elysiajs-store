import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import * as zod from "zod";
import { relations } from "drizzle-orm";

export const categories: any = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  parent: integer("parent"),
  description: varchar("description", { length: 255 }),
  deleted: boolean("deleted").notNull().default(false),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export const categoriesRelations = relations(categories, ({ one }) => ({
  parentCategory: one(categories, {
    fields: [categories.parent],
    references: [categories.id],
    relationName: "parentCategory",
  }),
}));

export const CategoriesSchema = createSelectSchema(categories);
export const NewCategoriesSchema = createInsertSchema(categories).pick({
  name: true,
  parent: true,
  description: true,
});

export type TCategories = zod.infer<typeof CategoriesSchema>;
export type TNewCategories = zod.infer<typeof NewCategoriesSchema>;
