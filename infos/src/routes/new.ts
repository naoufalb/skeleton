import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@naoufalbelhour/skeleton-common';
import { Info } from '../models/info';
import { InfoCreatedPublisher } from '../events/publishers/info-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/info',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('content').not().isEmpty().withMessage('Content is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, content } = req.body;

    const info = Info.build({
      title,
      content,
      userId: req.currentUser!.id,
    });
    await info.save();
    new InfoCreatedPublisher(natsWrapper.client).publish({
      id: info.id,
      title: info.title,
      content: info.content,
      userId: info.userId,
      version: info.version,
    });

    res.status(201).send(info);
  }
);

export { router as createInfoRouter };
