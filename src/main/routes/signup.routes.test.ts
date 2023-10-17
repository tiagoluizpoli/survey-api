import { MongoHelper } from '../../infrastructure';
import app from '../config/app';
import request from 'supertest';
describe('Signup Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('account');
    await accountCollection.deleteMany({});
  });
  it('should return an account on success', async () => {
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
