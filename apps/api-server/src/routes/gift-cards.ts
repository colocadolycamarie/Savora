import { Router, type IRouter } from 'express';
import { db, giftCardsTable } from '@workspace/db';
import { CreateGiftCardBody, CreateGiftCardResponse } from '@workspace/api-zod';
import { generateCode } from '../lib/codes';
import { asyncHandler, HttpError } from '../middleware/error-handler';

const router: IRouter = Router();

router.post(
  '/gift-cards',
  asyncHandler(async (req, res) => {
    const body = CreateGiftCardBody.parse(req.body);

    const fields: Record<string, string> = {};
    if (body.recipientType === 'gift') {
      if (!body.recipientName?.trim()) fields.recipientName = 'Recipient name is required.';
      if (body.deliveryMethod === 'email' && !body.recipientEmail) {
        fields.recipientEmail = 'Recipient email is required for email delivery.';
      }
      if (body.deliveryMethod === 'physical' && !body.mailingAddress?.trim()) {
        fields.mailingAddress = 'A mailing address is required for physical delivery.';
      }
    }
    if (Object.keys(fields).length > 0) {
      throw new HttpError(400, 'The request failed validation.', fields);
    }

    let attempt = 0;
    for (;;) {
      attempt += 1;
      try {
        const [created] = await db
          .insert(giftCardsTable)
          .values({
            code: generateCode('GIFT'),
            amount: body.amount,
            recipientType: body.recipientType,
            deliveryMethod: body.deliveryMethod,
            recipientName: body.recipientType === 'gift' ? body.recipientName : body.senderName,
            recipientEmail: body.recipientType === 'gift' ? body.recipientEmail : body.senderEmail,
            mailingAddress: body.mailingAddress,
            senderName: body.senderName,
            senderEmail: body.senderEmail,
            message: body.message,
          })
          .returning();

        res.status(201).json(
          CreateGiftCardResponse.parse({
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
