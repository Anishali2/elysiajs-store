import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import * as zod from "zod";

export const permissions = pgTable("permissions", {
  id: serial("id").primaryKey().unique(),
  resource: varchar("title", { length: 255 }).notNull(),
  action: varchar("title", { length: 255 }).notNull(),
});

export const PermissionSchema = createSelectSchema(permissions);
export const NewPermissionSchema = createInsertSchema(permissions).pick({
  resource: true,
  action: true,
});

export type TPermission = zod.infer<typeof PermissionSchema>;
export type TNewPermission = zod.infer<typeof NewPermissionSchema>;
