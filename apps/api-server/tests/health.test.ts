import { describe, it, expect, afterAll } from 'vitest';
import request from 'supertest';
import { pool } from '@workspace/db';
import app from '../src/app';

describe('GET /api/healthz', () => {
  afterAll(async () => {
    await pool.end();
  });

  it('returns a healthy status', async () => {
    const res = await request(app).get('/api/healthz');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('unmatched routes', () => {
  it('returns a JSON 404 instead of an HTML error page', async () => {
    const res = await request(app).get('/api/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});
