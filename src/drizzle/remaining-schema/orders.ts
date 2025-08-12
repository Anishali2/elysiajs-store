import {
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  integer,
  decimal,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import * as zod from "zod";
import { users } from "./users";
import { orderItems } from "./order_items";

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  orderNumber: varchar("order_number", { length: 100 }).notNull().unique(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  customerName: varchar("customer_name", { length: 255 }),
  customerPhone: varchar("customer_phone", { length: 20 }),
  customerAddress: text("customer_address"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
}, (table) => {
  return {
    userIdIdx: index("orders_user_id_idx").on(table.userId),
    statusIdx: index("orders_status_idx").on(table.status),
    createdAtIdx: index("orders_created_at_idx").on(table.createdAt),
  };
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  orderItems: many(orderItems),
}));

export const OrderSchema = createSelectSchema(orders);
export const NewOrderSchema = createInsertSchema(orders).pick({
  userId: true,
  orderNumber: true,
  totalAmount: true,
  status: true,
  customerName: true,
  customerPhone: true,
  customerAddress: true,
  notes: true,
});

export type TOrder = zod.infer<typeof OrderSchema>;
export type TNewOrder = zod.infer<typeof NewOrderSchema>;
