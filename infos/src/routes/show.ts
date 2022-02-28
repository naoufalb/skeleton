import express, { Request, Response } from 'express';
import { NotFoundError } from '@naoufalbelhour/skeleton-common';
import { Info } from '../models/info';

const router = express.Router();

router.get('/api/infos/:id', async (req: Request, res: Response) => {
  const info = await Info.findById(req.params.id);

  if (!info) {
    throw new NotFoundError();
  }

  res.send(info);
});

export { router as showInfoRouter };
