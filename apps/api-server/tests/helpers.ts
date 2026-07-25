import { sql } from 'drizzle-orm';
import { db } from '@workspace/db';

export async function resetDb() {
  await db.execute(
    sql`TRUNCATE TABLE reservations, gift_cards, contact_messages RESTART IDENTITY CASCADE`,
  );
}
