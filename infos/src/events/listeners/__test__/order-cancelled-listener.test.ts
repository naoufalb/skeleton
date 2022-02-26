import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCancelledEvent } from '@naoufalbelhour/common';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { Info } from '../../../models/info';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = mongoose.Types.ObjectId().toHexString();
  const info = Info.build({
    title: 'concert',
    price: 20,
    userId: 'asdf',
  });
  info.set({ orderId });
  await info.save();

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    info: {
      id: info.id,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { msg, data, info, orderId, listener };
};

it('updates the info, publishes an event, and acks the message', async () => {
  const { msg, data, info, orderId, listener } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Info.findById(info.id);
  expect(updatedTicket!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
