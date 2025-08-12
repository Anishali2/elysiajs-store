import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import * as zod from "zod";
import { relations } from "drizzle-orm";
import { products } from "./products";

export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  contactPerson: text("contact_person"),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),
  country: varchar("country", { length: 100 }),
  postalCode: varchar("postal_code", { length: 20 }),
  taxId: varchar("tax_id", { length: 50 }),
  paymentTerms: text("payment_terms"), // e.g., "Net 30", "Net 60", "COD"
  notes: text("notes"),
  isActive: boolean("is_active").notNull().default(true),
  deleted: boolean("deleted").notNull().default(false),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export const suppliersRelations = relations(suppliers, ({ many }) => ({
  products: many(products),
}));

export const SuppliersSchema = createSelectSchema(suppliers);
export const NewSuppliersSchema = createInsertSchema(suppliers).pick({
  name: true,
  contactPerson: true,
  email: true,
  phone: true,
  address: true,
  city: true,
  state: true,
  country: true,
  postalCode: true,
  taxId: true,
  paymentTerms: true,
  notes: true,
  isActive: true,
});

export type TSupplier = zod.infer<typeof SuppliersSchema>;
export type TNewSupplier = zod.infer<typeof NewSuppliersSchema>;

