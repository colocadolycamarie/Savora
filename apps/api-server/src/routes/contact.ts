import { Router, type IRouter } from 'express';
import { db, contactMessagesTable } from '@workspace/db';
import { CreateContactMessageBody, CreateContactMessageResponse } from '@workspace/api-zod';
import { asyncHandler } from '../middleware/error-handler';

const router: IRouter = Router();

router.post(
  '/contact',
  asyncHandler(async (req, res) => {
    const body = CreateContactMessageBody.parse(req.body);

    const [created] = await db
      .insert(contactMessagesTable)
      .values({
        subject: body.subject,
        name: body.name,
        email: body.email,
        message: body.message,
      })
      .returning();

    res.status(201).json(
      CreateContactMessageResponse.parse({
        ...created,
        createdAt: created.createdAt.toISOString(),
      }),
    );
  }),
);

export default router;
