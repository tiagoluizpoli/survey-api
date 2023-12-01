import { SurveyModel } from '@/domain';
import { LoadSurveysRepository } from '@/data';
import { DbLoadSurveys } from './db-load-surveys';
import { mockSurveyData } from '@/domain/test';

const makeLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    loadAll = (): Promise<SurveyModel[]> => {
      const { surveysMock } = mockSurveyData();
      return Promise.resolve(surveysMock);
    };
  }

  return new LoadSurveysRepositoryStub();
};

interface MakeSutResult {
  sut: DbLoadSurveys;
  loadSurveysRepositoryStub: LoadSurveysRepository;
}

const makeSut = (): MakeSutResult => {
  const loadSurveysRepositoryStub = makeLoadSurveysRepository();
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub);

  return { sut, loadSurveysRepositoryStub };
};

describe('DbLoadSurveys', () => {
  it('shoud call LoadSurveysRepository', async () => {
    // Arrange
    const { sut, loadSurveysRepositoryStub } = makeSut();
    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll');

    // Act
    await sut.load();

    // Assert
    expect(loadAllSpy).toHaveBeenCalled();
  });

  it('shoud return a List of Surveys on success', async () => {
    // Arrange
    const { sut } = makeSut();
    const { surveysMock } = mockSurveyData();

    // Act
    const surveysResult = await sut.load();

    // Assert
    expect(surveysResult).toEqual(surveysMock);
  });

  it('shoud throw if LoadSurveyRepository throws', async () => {
    // Arrange
    const { sut, loadSurveysRepositoryStub } = makeSut();

    jest
      .spyOn(loadSurveysRepositoryStub, 'loadAll')
      .mockReturnValueOnce(Promise.reject(new Error()));

    // Act
    const promise = sut.load();

    // Assert
    await expect(promise).rejects.toThrow();
  });
});
