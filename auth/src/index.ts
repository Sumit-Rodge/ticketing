import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  console.log('Starting up...');
  if (!process.env.JWT_KEY) {
    throw Error('JWT_KEY environment variable not defined');
  }
  if (!process.env.MONGO_URI) {
    throw Error('MONGO_URI environment variable not defined');
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('connected to DB');
  } catch (error) {
    console.log(error);
  }

  app.listen(3000, () => {
    console.log(`Auth listeing on port 3000!!!`);
  });
};

start();
