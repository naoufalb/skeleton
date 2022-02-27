import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a 404 if the info is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(`/api/infos/${id}`).send().expect(404);
});

it('returns the info if the info is found', async () => {
  const title = 'concert';
  const content = 20;

  const response = await request(app)
    .post('/api/infos')
    .set('Cookie', global.signin())
    .send({
      title,
      content,
    })
    .expect(201);

  const tnfoResponse = await request(app)
    .get(`/api/infos/${response.body.id}`)
    .send()
    .expect(200);

  expect(tnfoResponse.body.title).toEqual(title);
  expect(tnfoResponse.body.content).toEqual(content);
});
