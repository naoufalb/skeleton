import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Info } from '../../models/info';
import { natsWrapper } from '../../nats-wrapper';

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/infos/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'aslkdfj',
      content: 20,
    })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/infos/${id}`)
    .send({
      title: 'aslkdfj',
      content: 20,
    })
    .expect(401);
});

it('returns a 401 if the user does not own the info', async () => {
  const response = await request(app)
    .post('/api/infos')
    .set('Cookie', global.signin())
    .send({
      title: 'asldkfj',
      content: 20,
    });

  await request(app)
    .put(`/api/infos/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'alskdjflskjdf',
      content: 1000,
    })
    .expect(401);
});

it('returns a 400 if the user provides an invalid title or content', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/infos')
    .set('Cookie', cookie)
    .send({
      title: 'asldkfj',
      content: 20,
    });

  await request(app)
    .put(`/api/infos/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      content: 20,
    })
    .expect(400);

  await request(app)
    .put(`/api/infos/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'alskdfjj',
      content: -10,
    })
    .expect(400);
});

it('updates the info provided valid inputs', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/infos')
    .set('Cookie', cookie)
    .send({
      title: 'asldkfj',
      content: 20,
    });

  await request(app)
    .put(`/api/infos/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      content: 100,
    })
    .expect(200);

  const tnfoResponse = await request(app)
    .get(`/api/infos/${response.body.id}`)
    .send();

  expect(tnfoResponse.body.title).toEqual('new title');
  expect(tnfoResponse.body.content).toEqual(100);
});

it('publishes an event', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/infos')
    .set('Cookie', cookie)
    .send({
      title: 'asldkfj',
      content: 20,
    });

  await request(app)
    .put(`/api/infos/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      content: 100,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects updates if the info is reserved', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/infos')
    .set('Cookie', cookie)
    .send({
      title: 'asldkfj',
      content: 20,
    });

  const info = await Info.findById(response.body.id);
  info!.set({ orderId: mongoose.Types.ObjectId().toHexString() });
  await info!.save();

  await request(app)
    .put(`/api/infos/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      content: 100,
    })
    .expect(400);
});
