import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener';
import { PaymentCreatedListener } from './events/listeners/payment-created-listener';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw Error('JWT_KEY environment variable not defined');
  }
  if (!process.env.MONGO_URI) {
    throw Error('MONGO_URI environment variable not defined');
  }
  if (!process.env.NATS_URL) {
    throw Error('NATS_URL environment variable not defined');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw Error('NATS_CLIENT_ID environment variable not defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw Error('NATS_CLUSTER_ID environment variable not defined');
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on('close', () => {
      console.log(`NARS connection closed!`);
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    new ExpirationCompleteListener(natsWrapper.client).listen();
    new PaymentCreatedListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI);
    console.log('connected to DB');
  } catch (error) {
    console.log(error);
  }

  app.listen(3000, () => {
    console.log(`Orders listeing on port 3000!!!`);
  });
};

start();
