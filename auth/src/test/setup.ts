import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';
import { ChildProcessWithoutNullStreams } from 'child_process';

declare global {
  function signin(): Promise<string[]>;
}

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'asdf';

  // mongo = new MongoMemoryServer();
  // const mongoUri = await mongo.getUri();
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  // await mongoose.connect(mongoUri);
  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const collections = await mongoose.connection.db!.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = async () => {
  const email = 'test@test.com';
  const password = 'test';

  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email,
      password,
    })
    .expect(201);

  const cookie = response.get('Set-Cookie');

  if (!cookie) {
    return [''];
  }
  return cookie;
};
