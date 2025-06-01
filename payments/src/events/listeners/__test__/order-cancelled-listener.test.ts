import mongoose from 'mongoose';
import { Order } from '../../../models/order';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { OrderCancelledEvent, OrderStatus } from '@sumit-r/tic-common';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 89,
    userId: 'asdfa',
    version: 0,
  });

  await order.save();

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: 'asdfa',
    },
  };

  // @ts-ignore``
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, order };
};

it('Update the status fo the order', async () => {
  const { listener, data, msg, order } = await setup();
  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('Acks the message!', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
