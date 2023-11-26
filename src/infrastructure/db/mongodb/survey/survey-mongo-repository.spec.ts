import { AddSurveyModel } from '../../../../domain';
import { MongoHelper } from '../helpers/mongo.helper';
import { SurveyMongoRepository } from './survey-mongo-repository';
import { AddSurveyRepository } from '../../../../data';
import { Collection } from 'mongodb';

interface MakeFakeDataResult {
  addAccount: AddSurveyModel;
}
const makeFakeData = (): MakeFakeDataResult => {
  const addAccount: AddSurveyModel = {
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

  return { addAccount };
};

interface MakeSutResult {
  sut: AddSurveyRepository;
}
const makeSut = (): MakeSutResult => {
  const sut = new SurveyMongoRepository();
  return { sut };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let surveyCollection: Collection;
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
  });

  describe('add()', () => {
    it('should add a survey on success', async () => {
      const { sut } = makeSut();
      const { addAccount } = makeFakeData();

      await sut.add(addAccount);

      const survey = await surveyCollection.findOne({
        question: addAccount.question,
      });

      expect(survey).toBeTruthy();
    });
  });
});
