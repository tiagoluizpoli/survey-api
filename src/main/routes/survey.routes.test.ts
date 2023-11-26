import { Collection } from 'mongodb';
import { MongoHelper } from '../../infrastructure';
import app from '../config/app';
import request from 'supertest';
import { sign } from 'jsonwebtoken';
import { env } from '../config/env';

let surveyCollection: Collection;
let accountCollection: Collection;
describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.deleteMany({});
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  describe('POST /surveys', () => {
    it('should return 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'Question',
          answers: [
            {
              answer: 'Answer 1',
              image: 'http://image-name.com',
            },
            {
              answer: 'Answer 2',
            },
          ],
        })
        .expect(403);
    });

    it('should return 204 with valid token', async () => {
      const account = await accountCollection.insertOne({
        name: 'Tiago',
        email: 'tiagoluizpoli@gmail.com',
        password: '123',
        role: 'admin',
      });
      const id = account.insertedId;
      const accessToken = await sign({ id }, env.jwtSecret);
      await accountCollection.updateOne(
        {
          _id: id,
        },
        {
          $set: {
            accessToken,
          },
        },
      );
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'Question',
          answers: [
            {
              answer: 'Answer 1',
              image: 'http://image-name.com',
            },
            {
              answer: 'Answer 2',
            },
          ],
        })
        .expect(204);
    });
  });

  describe('GET /surveys', () => {
    it('should return 403 on load surveys without accessToken', async () => {
      await request(app).get('/api/surveys').expect(403);
    });
  });
});
