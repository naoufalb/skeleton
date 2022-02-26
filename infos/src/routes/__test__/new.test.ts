import request from 'supertest';
import { app } from '../../app';
import { Info } from '../../models/info';
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to /api/infos for post requests', async () => {
  const response = await request(app).post('/api/infos').send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  await request(app).post('/api/infos').send({}).expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/infos')
    .set('Cookie', global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/infos')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 10,
    })
    .expect(400);

  await request(app)
    .post('/api/infos')
    .set('Cookie', global.signin())
    .send({
      price: 10,
    })
    .expect(400);
});

it('returns an error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/infos')
    .set('Cookie', global.signin())
    .send({
      title: 'asldkjf',
      price: -10,
    })
    .expect(400);

  await request(app)
    .post('/api/infos')
    .set('Cookie', global.signin())
    .send({
      title: 'laskdfj',
    })
    .expect(400);
});

it('creates a info with valid inputs', async () => {
  let infos = await Info.find({});
  expect(infos.length).toEqual(0);

  const title = 'asldkfj';

  await request(app)
    .post('/api/infos')
    .set('Cookie', global.signin())
    .send({
      title,
      price: 20,
    })
    .expect(201);

  infos = await Info.find({});
  expect(infos.length).toEqual(1);
  expect(infos[0].price).toEqual(20);
  expect(infos[0].title).toEqual(title);
});

it('publishes an event', async () => {
  const title = 'asldkfj';

  await request(app)
    .post('/api/infos')
    .set('Cookie', global.signin())
    .send({
      title,
      price: 20,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
