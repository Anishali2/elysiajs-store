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
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import * as zod from "zod";
import { orders } from "./orders";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 20 }).notNull(),
  description: text("description"),
  address: text("address"),
  deleted: boolean("deleted").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  roleId: integer("role_id"), // For future role-based access
  lastLoginAt: timestamp("last_login_at", { mode: "string" }),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
}, (table) => {
  return {
    emailIdx: index("users_email_idx").on(table.email),
    isActiveIdx: index("users_is_active_idx").on(table.isActive),
    phoneIdx: index("users_phone_idx").on(table.phone),
    deletedIdx: index("users_deleted_idx").on(table.deleted),
  };
});

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
}));

export const UserSchema = createSelectSchema(users);
export const NewUserSchema = createInsertSchema(users).pick({
  name: true,
  email: true,
  phone: true,
  description: true,
  address: true,
  deleted: true,
  isActive: true,
});

export type TUser = zod.infer<typeof UserSchema>;
export type TNewUser = zod.infer<typeof NewUserSchema>;
