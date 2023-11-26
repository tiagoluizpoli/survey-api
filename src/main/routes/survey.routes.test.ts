import { Collection } from 'mongodb';
import { MongoHelper } from '../../infrastructure';
import app from '../config/app';
import request from 'supertest';
import { sign } from 'jsonwebtoken';
import { env } from '../config/env';
import { AddSurveyModel } from '../../domain';

interface MakeFakeDataResult {
  addSurveys: AddSurveyModel[];
}
const makeFakeData = (): MakeFakeDataResult => {
  const addSurveys: AddSurveyModel[] = [
    {
      question: 'any_question',
      answers: [
        {
          image: 'any_image',
          answer: 'any_answer',
        },
        {
          answer: 'any_answer',
        },
      ],
      date: new Date(),
    },
  ];

  return { addSurveys };
};

let surveyCollection: Collection;
let accountCollection: Collection;
describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  afterEach(async () => {
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

    it('should return 200 on load surveys with valid token', async () => {
      const account = await accountCollection.insertOne({
        name: 'Tiago',
        email: 'tiagoluizpoli@gmail.com',
        password: '123',
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

      const { addSurveys } = makeFakeData();
      await surveyCollection.insertMany(addSurveys);

      await request(app).get('/api/surveys').set('x-access-token', accessToken).expect(200);
    });
  });
});
