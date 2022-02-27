import request from 'supertest';
import { app } from '../../app';

const createInfo = () => {
  return request(app).post('/api/infos').set('Cookie', global.signin()).send({
    title: 'asldkf',
    content: 20,
  });
};

it('can fetch a list of infos', async () => {
  await createInfo();
  await createInfo();
  await createInfo();

  const response = await request(app).get('/api/infos').send().expect(200);

  expect(response.body.length).toEqual(3);
});
