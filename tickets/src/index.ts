import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { OrderCancelledListerner } from './events/listeners/order-cancelled-listener';

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

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListerner(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI);
    console.log('connected to DB');
  } catch (error) {
    console.log(error);
  }

  app.listen(3000, () => {
    console.log(`Tickets listeing on port 3000!!!`);
  });
};

start();
