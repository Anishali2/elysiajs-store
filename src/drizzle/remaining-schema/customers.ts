import {
  boolean,
  json,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import * as zod from "zod";

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 500 }),
  address: text("address").notNull(),
  phone: varchar("phone", { length: 50 }).default(""),
  additionalInfo: json("additional_info").$type<
    {
      [key: string]: string | number | boolean;
    }[]
  >(),
  deleted: boolean("deleted").notNull().default(false),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
}, (table) => {
  return {
    nameIdx: index("customers_name_idx").on(table.name),
    phoneIdx: index("customers_phone_idx").on(table.phone),
    deletedIdx: index("customers_deleted_idx").on(table.deleted),
  };
});

export const CustomersSchema = createSelectSchema(customers);
export const NewCustomersSchema = createInsertSchema(customers).pick({
  name: true,
  description: true,
  address: true,
  phone: true,
  additionalInfo: true,
});

export type TCustomers = zod.infer<typeof CustomersSchema>;
export type TNewCustomers = zod.infer<typeof NewCustomersSchema>;
