import { Router, type IRouter } from 'express';
import { db, reservationsTable } from '@workspace/db';
import {
  CreateReservationBody,
  CreateReservationResponse,
  GetAvailabilityQueryParams,
  GetAvailabilityResponse,
} from '@workspace/api-zod';
import { checkAvailability } from '../lib/availability';
import { generateCode } from '../lib/codes';
import { asyncHandler, HttpError } from '../middleware/error-handler';

const router: IRouter = Router();

const DEPOSIT_THRESHOLD = 6;
const DEPOSIT_PER_GUEST = 3000;

function toDateString(value: Date): string {
  return value.toISOString().slice(0, 10);
}

router.get(
  '/availability',
  asyncHandler(async (req, res) => {
    const parsed = GetAvailabilityQueryParams.parse({
      date: new Date(String(req.query.date)),
      time: req.query.time,
      guests: req.query.guests,
    });

    const result = await checkAvailability(toDateString(parsed.date), parsed.time, parsed.guests);
    res.json(GetAvailabilityResponse.parse(result));
  }),
);

router.post(
  '/reservations',
  asyncHandler(async (req, res) => {
    const body = CreateReservationBody.parse(req.body);
    const dateStr = toDateString(body.date);

    const availability = await checkAvailability(dateStr, body.time, body.guests);
    if (availability.level === 'full') {
      throw new HttpError(409, 'This time slot is fully booked. Please choose another time.');
    }

    const depositRequired = body.guests >= DEPOSIT_THRESHOLD;
    const depositAmount = depositRequired ? body.guests * DEPOSIT_PER_GUEST : 0;

    // Confirmation codes are short and could theoretically collide; retry a
    // handful of times on the (rare) unique-constraint violation rather than
    // trusting randomness alone.
    let attempt = 0;
    for (;;) {
      attempt += 1;
      try {
        const [created] = await db
          .insert(reservationsTable)
          .values({
            name: body.name,
            email: body.email,
            phone: body.phone,
            date: dateStr,
            time: body.time,
            guests: body.guests,
            dietaryNotes: body.dietaryNotes,
            confirmationCode: generateCode('SVR'),
            depositRequired,
            depositAmount,
          })
          .returning();

        res.status(201).json(
          CreateReservationResponse.parse({
            ...created,
            createdAt: created.createdAt.toISOString(),
          }),
        );
        return;
      } catch (err) {
        const isUniqueViolation =
          typeof err === 'object' && err !== null && 'code' in err && err.code === '23505';
        if (isUniqueViolation && attempt < 5) continue;
        throw err;
      }
    }
  }),
);

export default router;
