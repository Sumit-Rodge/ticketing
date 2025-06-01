import { TicketCreatedEvent } from '@sumit-r/tic-common';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketCreatedListener } from '../ticket-created-listener';
import mongoose, { set } from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // Create an instance of listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  // create a fake data event
  const data: TicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 40,
    version: 0,
    userId: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
  };

  //Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('Creates and saves a ticket', async () => {
  const { listener, data, msg } = await setup();
  // Call the onMessage function with the data object and message object
  await listener.onMessage(data, msg);

  // Write assertion to make sure a ticket was create!
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.price).toEqual(data.price);
  expect(ticket!.title).toEqual(data.title);
});

it('Acks the message', async () => {
  const { listener, data, msg } = await setup();
  // Call the onMessage function with the data object and message object
  await listener.onMessage(data, msg);

  // Write assertion to make sure a ticket was create!
  expect(msg.ack).toHaveBeenCalled();
});
