import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';

it('Returns 404 if order is not found', async () => {
  const id = new mongoose.Types.ObjectId();
  await request(app)
    .get(`/api/orders/${id}`)
    .set('Cookie', global.signin())
    .expect(404);
});

it('Return 401 unauthorized if another user tries to delete another users order', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    title: 'some bs',
    price: 89,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  const user = global.signin();
  const user1 = global.signin();
  // Make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make request to change order status to cancelled
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user1)
    .send()
    .expect(401);
});

it('Changes order status to Cancelled an order', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'some bs',
    price: 89,
  });
  await ticket.save();

  const user = global.signin();
  // Make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make request to change the order status
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  // Expectation to make sure the thing is cancelled
  const updateOrder = await Order.findById(order.id);

  expect(updateOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('Emits a order cancelled event', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'some bs',
    price: 89,
  });
  await ticket.save();

  const user = global.signin();
  // Make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make request to change the order status
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
