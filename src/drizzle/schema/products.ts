import {
  boolean,
  integer,
  numeric,
  pgTable,
  real,
  serial,
  text,
  timestamp,
  varchar,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import * as zod from "zod";
import { suppliers } from "./suppliers";
import { relations } from "drizzle-orm";
import { categories } from "./categories";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull().default("0"),
  buyPrice: numeric("buy_price", { precision: 10, scale: 2 })
    .notNull()
    .default("0"),
  pastPrices: text("past_prices"), // JSON string for now
  stock: integer("stock").default(0),
  weight: real("weight"),
  sku: varchar("sku", { length: 100 }).unique(),
  notifyWhenStock: integer("notify_when_stock"),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
  subCategoryId: integer("sub_category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
  supplierId: integer("supplier_id")
    .notNull()
    .references(() => suppliers.id, { onDelete: "cascade" }),
  imageUrl: text("image_url"),
  media: text("media"),
  moreDetails: text("more_details"),
  status: text("status").notNull().default("active"), // draft active deleted
  deleted: boolean("deleted").notNull().default(false),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export const productsRelations = relations(products, ({ one }) => ({
  supplier: one(suppliers, {
    fields: [products.supplierId],
    references: [suppliers.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
    relationName: "productCategory",
  }),
  subCategory: one(categories, {
    fields: [products.subCategoryId],
    references: [categories.id],
    relationName: "productSubCategory",
  }),
}));

export const ProductsSchema = createSelectSchema(products);
export const NewProductsSchema = createInsertSchema(products).pick({
  name: true,
  description: true,
  price: true,
  buyPrice: true,
  pastPrices: true,
  stock: true,
  weight: true,
  sku: true,
  notifyWhenStock: true,
  categoryId: true,
  subCategoryId: true,
  supplierId: true,
  imageUrl: true,
  media: true,
  moreDetails: true,
  status: true,
});

export type TProduct = zod.infer<typeof ProductsSchema>;
export type TNewProduct = zod.infer<typeof NewProductsSchema>;
