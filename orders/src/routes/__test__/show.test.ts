import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Ticket } from '../../models/ticket';

it('Returns 404 if order is not found', async () => {
  const id = new mongoose.Types.ObjectId();
  await request(app)
    .get(`/api/orders/${id}`)
    .set('Cookie', global.signin())
    .expect(404);
});

it('Fetches the order', async () => {
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

  // Make request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it('Return 401 unauthorized if another user tries to access another users order', async () => {
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

  // Make request to fetch the order
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(401);
});
