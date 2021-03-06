import express, { Request, Response } from 'express';
import { Info } from '../models/info';

const router = express.Router();

router.get('/api/infos', async (req: Request, res: Response) => {
  const info = await Info.find({
    orderId: undefined,
  });

  res.send(info);
});

export { router as indexInfoRouter };
