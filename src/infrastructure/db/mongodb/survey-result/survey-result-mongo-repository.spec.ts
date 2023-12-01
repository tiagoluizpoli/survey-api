import { AddSurveyParams, SurveyModel } from '@/domain';
import { MongoHelper } from '../helpers/mongo.helper';
import { SurveyResultMongoRepository } from './survey-result-mongo-repository';
import { Collection } from 'mongodb';
import { mockAccountData } from '@/domain/test';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let surveyCollection: Collection;
let surveyResultCollection: Collection;
let accountCollection: Collection;

interface MakeFakeDataResult {
  addSurvey: AddSurveyParams;
}
const makeFakeData = (): MakeFakeDataResult => {
  const addSurvey: AddSurveyParams = {
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
  };

  return { addSurvey };
};

const makeSurvey = async (): Promise<SurveyModel> => {
  const { addSurvey } = makeFakeData();
  const insertResult = await surveyCollection.insertOne(addSurvey);
  const survey = await surveyCollection.findOne({ _id: insertResult.insertedId });

  return {
    id: insertResult.insertedId.toString(),
    question: survey!.question,
    answers: survey!.answers,
    date: survey!.date,
  };
};

const makeAccount = async (): Promise<string> => {
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
      const survey = await makeSurvey();
      const accountId = await makeAccount();
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
      const survey = await makeSurvey();
      const accountId = await makeAccount();
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
