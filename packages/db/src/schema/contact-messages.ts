import { pgTable, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { sql } from 'drizzle-orm';

export const contactSubjectEnum = pgEnum('contact_subject', [
  'general',
  'private',
  'press',
  'careers',
]);
export const contactMessageStatusEnum = pgEnum('contact_message_status', [
  'new',
  'read',
]);

export const contactMessagesTable = pgTable('contact_messages', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  subject: contactSubjectEnum('subject').notNull(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  message: text('message').notNull(),
  status: contactMessageStatusEnum('status').notNull().default('new'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const insertContactMessageSchema = createInsertSchema(contactMessagesTable).omit({
  id: true,
  status: true,
  createdAt: true,
});
export const selectContactMessageSchema = createSelectSchema(contactMessagesTable);

export type InsertContactMessage = typeof contactMessagesTable.$inferInsert;
export type ContactMessage = typeof contactMessagesTable.$inferSelect;
