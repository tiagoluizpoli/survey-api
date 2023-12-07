import { SurveyModel } from '@/domain';
import { MongoHelper } from '../helpers/mongo.helper';
import { SurveyResultMongoRepository } from './survey-result-mongo-repository';
import { Collection, ObjectId, WithId } from 'mongodb';
import { mockAccountData, mockSurveyData } from '@/domain/test';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let surveyCollection: Collection;
let surveyResultCollection: Collection;
let accountCollection: Collection;

const mockSurvey = async (): Promise<SurveyModel> => {
  const { addSurveyMock } = mockSurveyData();
  const insertResult = await surveyCollection.insertOne(addSurveyMock);
  const survey = await surveyCollection.findOne<SurveyModel>({ _id: insertResult.insertedId });

  return MongoHelper.map<SurveyModel>(survey as WithId<SurveyModel>);
};

const mockAccount = async (): Promise<string> => {
  const { addAccountMock } = mockAccountData();
  return (await accountCollection.insertOne(addAccountMock)).insertedId.toString();
};

interface MakeSutResult {
  sut: SurveyResultMongoRepository;
}
const makeSut = (): MakeSutResult => {
  const sut = new SurveyResultMongoRepository();
  return { sut };
};

describe('AccountRepository (Mongodb)', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.deleteMany({});

    surveyResultCollection = await MongoHelper.getCollection('surveyResults');
    await surveyResultCollection.deleteMany({});

    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  describe('save()', () => {
    it('should add a surveyResult if its new', async () => {
      const survey = await mockSurvey();
      const accountId = await mockAccount();
      const { sut } = makeSut();

      await sut.save({
        surveyId: survey.id,
        accountId,
        answer: survey.answers[0].answer,
        date: new Date(),
      });

      const surveyResult = await surveyResultCollection.findOne({
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(accountId),
      });

      expect(surveyResult).toBeTruthy();
    });

    it('should update a surveyResult if its not new', async () => {
      const survey = await mockSurvey();
      const accountId = await mockAccount();

      await surveyResultCollection.insertOne({
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(accountId),
        answer: survey.answers[0].answer,
        date: new Date(),
      });
      const { sut } = makeSut();

      await sut.save({
        surveyId: survey.id,
        accountId,
        answer: survey.answers[1].answer,
        date: new Date(),
      });

      const surveyResult = await surveyResultCollection
        .find({
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(accountId),
        })
        .toArray();

      expect(surveyResult).toBeTruthy();
      expect(surveyResult.length).toBe(1);
    });
  });

  describe('loadBySurveyId()', () => {
    it('should load a survey result', async () => {
      // Arrange
      const survey = await mockSurvey();
      const accountId = await mockAccount();

      await surveyResultCollection.insertMany([
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(accountId),
          answer: survey.answers[0].answer,
          date: new Date(),
        },
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(accountId),
          answer: survey.answers[0].answer,
          date: new Date(),
        },
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(accountId),
          answer: survey.answers[0].answer,
          date: new Date(),
        },
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(accountId),
          answer: survey.answers[1].answer,
          date: new Date(),
        },
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(accountId),
          answer: survey.answers[1].answer,
          date: new Date(),
        },
      ]);
      const { sut } = makeSut();

      // Act
      const surveyResult = await sut.loadBySurveyId(survey.id);

      // Assert
      expect(surveyResult).toBeTruthy();
      expect(surveyResult.surveyId.toString()).toEqual(survey.id);
      expect(surveyResult.answers[0].answer).toBe(survey.answers[0].answer);
      expect(surveyResult.answers[0].count).toBe(3);
      expect(surveyResult.answers[0].percent).toBe(60);
      expect(surveyResult.answers[1].count).toBe(2);
      expect(surveyResult.answers[1].percent).toBe(40);
      expect(surveyResult.answers[2].count).toBe(0);
      expect(surveyResult.answers[2].percent).toBe(0);
    });
  });
});
