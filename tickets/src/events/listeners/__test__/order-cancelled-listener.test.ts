import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCancelledListerner } from '../order-cancelled-listener';
import { OrderCancelledEvent } from '@sumit-r/tic-common';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  const listener = new OrderCancelledListerner(natsWrapper.client);

  const orderId = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    title: 'concert',
    price: 30,
    userId: 'asdf',
  });

  ticket.set({ orderId });

  await ticket.save();

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: { id: ticket.id },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { msg, data, orderId, ticket, listener };
};

it(' Updates the ticket , publishes an event and ack the message', async () => {
  const { msg, data, orderId, ticket, listener } = await setup();

  await listener.onMessage(data, msg);

  const updateTicket = await Ticket.findById(ticket.id);

  expect(updateTicket!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
