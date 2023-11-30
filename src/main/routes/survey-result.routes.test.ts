import { MongoHelper } from '@/infrastructure';
import app from '../config/app';
import request from 'supertest';
import { Collection } from 'mongodb';
import { env } from '../config';
import { sign } from 'jsonwebtoken';
interface MakeAccessTokenResult {
  accessToken: string;
}
const makeAccessToken = async (): Promise<MakeAccessTokenResult> => {
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

  return { accessToken };
};
interface MakeSurvey {
  surveyId: string;
}
const makeSurvey = async (): Promise<MakeSurvey> => {
  const survey = await surveyCollection.insertOne({
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
    date: new Date(),
  });
  const surveyId = survey.insertedId.toString();

  return { surveyId };
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

  describe('PUT /surveys/:surveyId/results', () => {
    it('should return 403 on save survey result without accessToken', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({
          answer: 'any_answer',
        })
        .expect(403);
    });

    it('should return 200 on save survey result with accessToken', async () => {
      const { accessToken } = await makeAccessToken();
      const { surveyId } = await makeSurvey();
      await request(app)
        .put(`/api/surveys/${surveyId}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'Answer 1',
        })
        .expect(200);
    });
  });
});
