import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@naoufalbelhour/skeleton-common';
import { createInfoRouter } from './routes/new';
import { showInfoRouter } from './routes/show';
import { indexInfoRouter } from './routes/index';
import { updateInfoRouter } from './routes/update';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);
app.use(currentUser);

app.use(createInfoRouter);
app.use(showInfoRouter);
app.use(indexInfoRouter);
app.use(updateInfoRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
