import { AddSurveyModel, SurveyModel } from '@/domain';
import { MongoHelper } from '../helpers/mongo.helper';
import { SurveyMongoRepository } from './survey-mongo-repository';
import { Collection } from 'mongodb';

interface MakeFakeDataResult {
  addSurvey: AddSurveyModel;
  addSurveys: AddSurveyModel[];
  surveys: SurveyModel[];
}
const makeFakeData = (): MakeFakeDataResult => {
  const addSurvey: AddSurveyModel = {
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

  const surveys: SurveyModel[] = [
    {
      id: 'any_id',
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
    {
      id: 'other_id',
      question: 'other_question',
      answers: [
        {
          image: 'other_image',
          answer: 'other_answer',
        },
        {
          answer: 'other_answer',
        },
      ],
      date: new Date(),
    },
  ];

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
    {
      question: 'other_question',
      answers: [
        {
          image: 'other_image',
          answer: 'other_answer',
        },
        {
          answer: 'other_answer',
        },
      ],
      date: new Date(),
    },
  ];

  return { addSurvey, addSurveys, surveys };
};

interface MakeSutResult {
  sut: SurveyMongoRepository;
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
      const { addSurvey } = makeFakeData();

      await sut.add(addSurvey);

      const survey = await surveyCollection.findOne({
        question: addSurvey.question,
      });

      expect(survey).toBeTruthy();
    });
  });

  describe('loadAll()', () => {
    it('should load all surveys on success', async () => {
      const { sut } = makeSut();
      const { addSurveys } = makeFakeData();
      await surveyCollection.insertMany(addSurveys);

      const surveysResult = await sut.loadAll();

      expect(surveysResult.length).toBe(2);
      expect(surveysResult[0].question).toBe('any_question');
      expect(surveysResult[1].question).toBe('other_question');
    });

    it('should return an empty list if there are no surveys', async () => {
      // Arrange
      const { sut } = makeSut();

      // Act
      const surveysResult = await sut.loadAll();

      // Assert
      expect(surveysResult.length).toBe(0);
    });
  });
});
