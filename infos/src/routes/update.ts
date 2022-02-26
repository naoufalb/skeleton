import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
  BadRequestError,
} from '@naoufalbelhour/common';
import { Info } from '../models/info';
import { InfoUpdatedPublisher } from '../events/publishers/info-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
  '/api/info/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('content').not().isEmpty().withMessage('Content is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const info = await Info.findById(req.params.id);

    if (!info) {
      throw new NotFoundError();
    }

    if (info.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    info.set({
      title: req.body.title,
      content: req.body.content,
    });
    await info.save();
    new InfoUpdatedPublisher(natsWrapper.client).publish({
      id: info.id,
      title: info.content,
      content: info.price,
      userId: info.userId,
      version: info.version,
    });

    res.send(info);
  }
);

export { router as updateTicketRouter };
