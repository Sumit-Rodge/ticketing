import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { OrderCreateListener } from './events/listeners/order-created-listener';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';

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
      console.log(`NARt connection closed!`);
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new OrderCreateListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI);
    console.log('connected to DB');
  } catch (error) {
    console.log(error);
  }

  app.listen(3000, () => {
    console.log(`Payments listeing on port 3000!!!`);
  });
};

start();
