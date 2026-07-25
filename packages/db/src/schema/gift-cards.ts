import { pgTable, text, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { sql } from 'drizzle-orm';

export const giftCardRecipientTypeEnum = pgEnum('gift_card_recipient_type', [
  'myself',
  'gift',
]);
export const giftCardDeliveryMethodEnum = pgEnum('gift_card_delivery_method', [
  'email',
  'physical',
]);
export const giftCardStatusEnum = pgEnum('gift_card_status', ['issued']);

export const giftCardsTable = pgTable('gift_cards', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  code: text('code').notNull().unique(),
  amount: integer('amount').notNull(),
  recipientType: giftCardRecipientTypeEnum('recipient_type').notNull(),
  deliveryMethod: giftCardDeliveryMethodEnum('delivery_method').notNull(),
  recipientName: text('recipient_name'),
  recipientEmail: text('recipient_email'),
  mailingAddress: text('mailing_address'),
  senderName: text('sender_name').notNull(),
  senderEmail: text('sender_email').notNull(),
  message: text('message'),
  status: giftCardStatusEnum('status').notNull().default('issued'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const insertGiftCardSchema = createInsertSchema(giftCardsTable).omit({
  id: true,
  code: true,
  status: true,
  createdAt: true,
});
export const selectGiftCardSchema = createSelectSchema(giftCardsTable);

export type InsertGiftCard = typeof giftCardsTable.$inferInsert;
export type GiftCard = typeof giftCardsTable.$inferSelect;
