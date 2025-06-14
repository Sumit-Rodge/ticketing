import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
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
    console.log('expiration is listening...');
  } catch (error) {
    console.log(error);
  }
};

start();
