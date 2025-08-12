import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

// Define the accounts table schema
export const accounts = pgTable('accounts', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 256 }),
  email: varchar('email', { length: 256 }),
  phone: varchar('phone', { length: 256 }),
  description: text('description'),
  location: varchar('location', { length: 256 }),
  joinDate: varchar('join_date', { length: 256 })
});

// Type inference for TypeScript
export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;