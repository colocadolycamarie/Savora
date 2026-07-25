import { and, eq, sql } from 'drizzle-orm';
import { db, reservationsTable } from '@workspace/db';

/** Seats available per reservation slot (matches the "24 seats" homepage stat). */
export const SLOT_CAPACITY = 24;

export type AvailabilityLevel = 'available' | 'limited' | 'full';

export async function getBookedSeats(date: string, time: string): Promise<number> {
  const [row] = await db
    .select({ total: sql<string>`coalesce(sum(${reservationsTable.guests}), 0)` })
    .from(reservationsTable)
    .where(
      and(
        eq(reservationsTable.date, date),
        eq(reservationsTable.time, time),
        eq(reservationsTable.status, 'confirmed'),
      ),
    );
  return Number(row?.total ?? 0);
}

export function levelFor(remainingSeats: number, capacity: number): AvailabilityLevel {
  if (remainingSeats <= 0) return 'full';
  if (remainingSeats / capacity <= 0.35) return 'limited';
  return 'available';
}

export async function checkAvailability(date: string, time: string, guests: number) {
  const booked = await getBookedSeats(date, time);
  const remainingSeats = Math.max(SLOT_CAPACITY - booked, 0);
  const level: AvailabilityLevel =
    remainingSeats < guests ? 'full' : levelFor(remainingSeats, SLOT_CAPACITY);

  return { level, remainingSeats, capacity: SLOT_CAPACITY };
}
