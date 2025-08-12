import {
  boolean,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import * as zod from "zod";
import { suppliers } from "./suppliers";
import { products } from "./products";
import { relations } from "drizzle-orm";

export const suppliersStock = pgTable("suppliers_stock", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  supplierId: integer("supplier_id")
    .notNull()
    .references(() => suppliers.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull().default(0),
  price: numeric("price", { precision: 10, scale: 2 }).notNull().default("0"),
  buyPrice: numeric("buy_price", { precision: 10, scale: 2 }).notNull().default("0"),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  paymentPending: boolean("payment_pending").notNull().default(true),
  paymentDueDate: timestamp("payment_due_date", { mode: "string" }),
  notes: text("notes"),
  batchNumber: text("batch_number"),
  expiryDate: timestamp("expiry_date", { mode: "string" }),
  status: text("status").notNull().default("active"), // active, sold, expired, returned
  deleted: boolean("deleted").notNull().default(false),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
}, (table) => {
  return {
    productIdIdx: index("suppliers_stock_product_id_idx").on(table.productId),
    supplierIdIdx: index("suppliers_stock_supplier_id_idx").on(table.supplierId),
    paymentPendingIdx: index("suppliers_stock_payment_pending_idx").on(table.paymentPending),
    statusIdx: index("suppliers_stock_status_idx").on(table.status),
    deletedIdx: index("suppliers_stock_deleted_idx").on(table.deleted),
    expiryDateIdx: index("suppliers_stock_expiry_date_idx").on(table.expiryDate),
  };
});

export const suppliersStockRelations = relations(suppliersStock, ({ one }) => ({
  product: one(products, {
    fields: [suppliersStock.productId],
    references: [products.id],
  }),
  supplier: one(suppliers, {
    fields: [suppliersStock.supplierId],
    references: [suppliers.id],
  }),
}));

export const suppliersStockProductRelations = relations(products, ({ many }) => ({
  suppliersStock: many(suppliersStock),
}));

export const suppliersStockSupplierRelations = relations(suppliers, ({ many }) => ({
  suppliersStock: many(suppliersStock),
}));

export const SuppliersStockSchema = createSelectSchema(suppliersStock);
export const NewSuppliersStockSchema = createInsertSchema(suppliersStock).pick({
  productId: true,
  supplierId: true,
  quantity: true,
  price: true,
  buyPrice: true,
  totalAmount: true,
  paymentPending: true,
  paymentDueDate: true,
  notes: true,
  batchNumber: true,
  expiryDate: true,
  status: true,
});

export type TSuppliersStock = zod.infer<typeof SuppliersStockSchema>;
export type TNewSuppliersStock = zod.infer<typeof NewSuppliersStockSchema>;