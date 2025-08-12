import {
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import * as zod from "zod";
import { roles } from "./roles";
import { permissions } from "./permissions";
import { relations } from "drizzle-orm";

export const rolePermissions = pgTable("role_permissions", {
  id: serial("id").primaryKey().unique(),
  roleId: integer("role_id")
    .notNull()
    .references(() => roles.id, { onDelete: "cascade" }),
  permissionId: integer("permission_id")
    .notNull()
    .references(() => permissions.id, { onDelete: "cascade" }),
});
export const rolePermissionsRelations = relations(
  rolePermissions,
  ({ one }) => ({
    role: one(roles, {
      fields: [rolePermissions.roleId],
      references: [roles.id],
    }),
    permission: one(permissions, {
      fields: [rolePermissions.permissionId],
      references: [permissions.id],
    }),
  }),
);

export const rolesRelations = relations(roles, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}));

// Update your permissions relations (add this to permissions.ts)
export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}));

export const PostSchema = createSelectSchema(rolePermissions);
export const NewPostSchema = createInsertSchema(rolePermissions).pick({
  roleId: true,
  permissionId: true,
});

export type TPost = zod.infer<typeof PostSchema>;
export type TNewPost = zod.infer<typeof NewPostSchema>;
