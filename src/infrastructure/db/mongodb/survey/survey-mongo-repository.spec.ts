import { mockSurveyData } from '@/domain/test';
import { MongoHelper } from '../helpers/mongo.helper';
import { SurveyMongoRepository } from './survey-mongo-repository';
import { Collection } from 'mongodb';

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
      const { addSurveyMock } = mockSurveyData();

      await sut.add(addSurveyMock);

      const survey = await surveyCollection.findOne({
        question: addSurveyMock.question,
      });

      expect(survey).toBeTruthy();
    });
  });

  describe('loadAll()', () => {
    it('should load all surveys on success', async () => {
      const { sut } = makeSut();
      const { addSurveysMock } = mockSurveyData();
      await surveyCollection.insertMany(addSurveysMock);

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

  describe('loadById()', () => {
    it('should load a survey by id on success', async () => {
      // Arrange
      const { sut } = makeSut();
      const { addSurveyMock } = mockSurveyData();
      const res = await surveyCollection.insertOne(addSurveyMock);
      const id = res.insertedId.toString();

      // Act
      const survey = await sut.loadById(id);

      // Assert
      expect(survey).toBeTruthy();
    });
  });
});
