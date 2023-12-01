import { SurveyModel } from '@/domain';
import { MongoHelper } from '../helpers/mongo.helper';
import { SurveyResultMongoRepository } from './survey-result-mongo-repository';
import { Collection } from 'mongodb';
import { mockAccountData, mockSurveyData } from '@/domain/test';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let surveyCollection: Collection;
let surveyResultCollection: Collection;
let accountCollection: Collection;

const mockSurvey = async (): Promise<SurveyModel> => {
  const { addSurveyMock } = mockSurveyData();
  const insertResult = await surveyCollection.insertOne(addSurveyMock);
  const survey = await surveyCollection.findOne({ _id: insertResult.insertedId });

  return {
    id: insertResult.insertedId.toString(),
    question: survey!.question,
    answers: survey!.answers,
    date: survey!.date,
  };
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

      const surveyResult = await sut.save({
        surveyId: survey.id,
        accountId,
        answer: survey.answers[0].answer,
        date: new Date(),
      });

      expect(surveyResult).toBeTruthy();
      expect(surveyResult.id).toBeTruthy();
      expect(surveyResult.answer).toEqual(survey.answers[0].answer);
    });

    it('should update a surveyResult if its not new', async () => {
      const survey = await mockSurvey();
      const accountId = await mockAccount();
      const res = await surveyResultCollection.insertOne({
        surveyId: survey.id,
        accountId,
        answer: survey.answers[0].answer,
        date: new Date(),
      });
      const { sut } = makeSut();

      const surveyResult = await sut.save({
        surveyId: survey.id,
        accountId,
        answer: survey.answers[1].answer,
        date: new Date(),
      });

      expect(surveyResult).toBeTruthy();
      expect(surveyResult.id).toEqual(res.insertedId.toString());
      expect(surveyResult.answer).toEqual(survey.answers[1].answer);
    });
  });
});
