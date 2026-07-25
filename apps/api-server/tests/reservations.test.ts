import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { pool, reservationsTable, db } from '@workspace/db';
import app from '../src/app';
import { resetDb } from './helpers';

afterAll(async () => {
  await pool.end();
});

const validPayload = {
  name: 'Maria Clara',
  email: 'maria@example.com',
  phone: '+639171234567',
  date: '2027-03-15',
  time: '19:00',
  guests: 2,
};

describe('POST /api/reservations', () => {
  beforeEach(resetDb);

  it('creates a reservation and returns a confirmation code', async () => {
    const res = await request(app).post('/api/reservations').send(validPayload);

    expect(res.status).toBe(201);
    expect(res.body.confirmationCode).toMatch(/^SVR-[A-Z0-9]{6}$/);
    expect(res.body.name).toBe(validPayload.name);
    expect(res.body.depositRequired).toBe(false);
    expect(res.body.depositAmount).toBe(0);
    expect(res.body.status).toBe('confirmed');
  });

  it('requires a deposit for parties of 6 or more', async () => {
    const res = await request(app)
      .post('/api/reservations')
      .send({ ...validPayload, guests: 6, time: '18:00' });

    expect(res.status).toBe(201);
    expect(res.body.depositRequired).toBe(true);
    expect(res.body.depositAmount).toBe(6 * 3000);
  });

  it('rejects an invalid email with a field-level error', async () => {
    const res = await request(app)
      .post('/api/reservations')
      .send({ ...validPayload, email: 'not-an-email' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeTruthy();
    expect(res.body.fields).toHaveProperty('email');
  });

  it('rejects a party size over the maximum', async () => {
    const res = await request(app)
      .post('/api/reservations')
      .send({ ...validPayload, guests: 999 });

    expect(res.status).toBe(400);
    expect(res.body.fields).toHaveProperty('guests');
  });

  it('rejects a malformed time string', async () => {
    const res = await request(app)
      .post('/api/reservations')
      .send({ ...validPayload, time: '7pm' });

    expect(res.status).toBe(400);
    expect(res.body.fields).toHaveProperty('time');
  });

  it('returns 409 when the slot is fully booked', async () => {
    // Fill the slot to capacity (24 seats) directly, then attempt one more.
    await db.insert(reservationsTable).values({
      name: 'Existing Party',
      email: 'existing@example.com',
      phone: '+639170000000',
      date: validPayload.date,
      time: validPayload.time,
      guests: 24,
      confirmationCode: 'SVR-TEST01',
      depositRequired: true,
      depositAmount: 72000,
    });

    const res = await request(app).post('/api/reservations').send(validPayload);

    expect(res.status).toBe(409);
    expect(res.body.error).toMatch(/fully booked/i);
  });
});

describe('GET /api/availability', () => {
  beforeEach(resetDb);

  it('reports full capacity as available with no existing bookings', async () => {
    const res = await request(app)
      .get('/api/availability')
      .query({ date: '2027-03-20', time: '19:00', guests: 2 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ level: 'available', remainingSeats: 24, capacity: 24 });
  });

  it('reflects existing bookings when computing remaining seats', async () => {
    await db.insert(reservationsTable).values({
      name: 'Existing Party',
      email: 'existing@example.com',
      phone: '+639170000000',
      date: '2027-03-20',
      time: '19:00',
      guests: 20,
      confirmationCode: 'SVR-TEST02',
      depositRequired: true,
      depositAmount: 60000,
    });

    const res = await request(app)
      .get('/api/availability')
      .query({ date: '2027-03-20', time: '19:00', guests: 2 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ level: 'limited', remainingSeats: 4, capacity: 24 });
  });

  it('rejects a missing guests parameter', async () => {
    const res = await request(app)
      .get('/api/availability')
      .query({ date: '2027-03-20', time: '19:00' });

    expect(res.status).toBe(400);
  });
});
