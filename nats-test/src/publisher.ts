import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();
//creating nats client
const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', async () => {
  console.log('Publisher is connected to nats');

  const publisher = new TicketCreatedPublisher(stan);

  const data = JSON.stringify({
    id: '123',
    title: 'coldplay',
    price: 200,
  });

  stan.publish('ticket:created', data, () => {
    console.log('Event published');
  });
});
