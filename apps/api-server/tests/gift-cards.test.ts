import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { pool } from '@workspace/db';
import app from '../src/app';
import { resetDb } from './helpers';

describe('POST /api/gift-cards', () => {
  beforeEach(resetDb);
  afterAll(async () => {
    await pool.end();
  });

  it('creates a gift card for myself without requiring recipient fields', async () => {
    const res = await request(app).post('/api/gift-cards').send({
      amount: 1000,
      recipientType: 'myself',
      deliveryMethod: 'email',
      senderName: 'Juan',
      senderEmail: 'juan@example.com',
    });

    expect(res.status).toBe(201);
    expect(res.body.code).toMatch(/^GIFT-[A-Z0-9]{6}$/);
    expect(res.body.amount).toBe(1000);
  });

  it('creates a gift card sent by email to someone else', async () => {
    const res = await request(app).post('/api/gift-cards').send({
      amount: 2500,
      recipientType: 'gift',
      deliveryMethod: 'email',
      recipientName: 'Ana',
      recipientEmail: 'ana@example.com',
      senderName: 'Juan',
      senderEmail: 'juan@example.com',
    });

    expect(res.status).toBe(201);
  });

  it('rejects a gift without a recipient name', async () => {
    const res = await request(app).post('/api/gift-cards').send({
      amount: 1000,
      recipientType: 'gift',
      deliveryMethod: 'email',
      recipientEmail: 'ana@example.com',
      senderName: 'Juan',
      senderEmail: 'juan@example.com',
    });

    expect(res.status).toBe(400);
    expect(res.body.fields).toHaveProperty('recipientName');
  });

  it('rejects email delivery without a recipient email', async () => {
    const res = await request(app).post('/api/gift-cards').send({
      amount: 1000,
      recipientType: 'gift',
      deliveryMethod: 'email',
      recipientName: 'Ana',
      senderName: 'Juan',
      senderEmail: 'juan@example.com',
    });

    expect(res.status).toBe(400);
    expect(res.body.fields).toHaveProperty('recipientEmail');
  });

  it('rejects physical delivery without a mailing address', async () => {
    const res = await request(app).post('/api/gift-cards').send({
      amount: 1000,
      recipientType: 'gift',
      deliveryMethod: 'physical',
      recipientName: 'Ana',
      senderName: 'Juan',
      senderEmail: 'juan@example.com',
    });

    expect(res.status).toBe(400);
    expect(res.body.fields).toHaveProperty('mailingAddress');
  });

  it('rejects an amount below the minimum', async () => {
    const res = await request(app).post('/api/gift-cards').send({
      amount: 100,
      recipientType: 'myself',
      deliveryMethod: 'email',
      senderName: 'Juan',
      senderEmail: 'juan@example.com',
    });

    expect(res.status).toBe(400);
    expect(res.body.fields).toHaveProperty('amount');
  });
});
