import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { pool } from '@workspace/db';
import app from '../src/app';
import { resetDb } from './helpers';

const validPayload = {
  subject: 'general' as const,
  name: 'Ana',
  email: 'ana@example.com',
  message: 'Do you take walk-ins on weekdays?',
};

describe('POST /api/contact', () => {
  beforeEach(resetDb);
  afterAll(async () => {
    await pool.end();
  });

  it('creates a contact message', async () => {
    const res = await request(app).post('/api/contact').send(validPayload);

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('new');
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('createdAt');
  });

  it('rejects a message that is too short', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ ...validPayload, message: 'Hi' });

    expect(res.status).toBe(400);
    expect(res.body.fields).toHaveProperty('message');
  });

  it('rejects an invalid subject', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ ...validPayload, subject: 'not-a-real-subject' });

    expect(res.status).toBe(400);
    expect(res.body.fields).toHaveProperty('subject');
  });

  it('rejects a missing name', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ ...validPayload, name: '' });

    expect(res.status).toBe(400);
    expect(res.body.fields).toHaveProperty('name');
  });
});
