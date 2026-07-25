import { pgTable, text, integer, boolean, timestamp, pgEnum, date } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { sql } from 'drizzle-orm';

export const reservationStatusEnum = pgEnum('reservation_status', [
  'confirmed',
  'cancelled',
]);

export const reservationsTable = pgTable('reservations', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  confirmationCode: text('confirmation_code').notNull().unique(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  date: date('date', { mode: 'string' }).notNull(),
  time: text('time').notNull(),
  guests: integer('guests').notNull(),
  dietaryNotes: text('dietary_notes'),
  depositRequired: boolean('deposit_required').notNull().default(false),
  depositAmount: integer('deposit_amount').notNull().default(0),
  status: reservationStatusEnum('status').notNull().default('confirmed'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const insertReservationSchema = createInsertSchema(reservationsTable).omit({
  id: true,
  confirmationCode: true,
  depositRequired: true,
  depositAmount: true,
  status: true,
  createdAt: true,
});
export const selectReservationSchema = createSelectSchema(reservationsTable);

export type InsertReservation = typeof reservationsTable.$inferInsert;
export type Reservation = typeof reservationsTable.$inferSelect;
