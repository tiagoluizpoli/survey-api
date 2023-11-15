import { Collection } from 'mongodb';
import { MongoHelper } from '../../infrastructure';
import app from '../config/app';
import request from 'supertest';
import { hash } from 'bcrypt';

let accountCollection: Collection;
describe('Authentication Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  describe('POST /signup', () => {
    it('should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Tiago',
          email: 'tiago.shablaw@gmail.com',
          password: '123',
          passwordConfirmation: '123',
        })
        .expect(200);
    });
  });

  describe('POST /signin', () => {
    it('should return 200 on login', async () => {
      const password = await hash('123', 12);

      await accountCollection.insertOne({
        name: 'Tiago',
        email: 'tiago.shablaw@gmail.com',
        password,
      });
      await request(app)
        .post('/api/signin')
        .send({
          email: 'tiago.shablaw@gmail.com',
          password: '123',
        })
        .expect(200);
    });

    it('should return 401 on login with incorrect credentials', async () => {
      await request(app)
        .post('/api/signin')
        .send({
          email: 'tiago.shablaw@gmail.com',
          password: '123',
        })
        .expect(401);
    });
  });
});
