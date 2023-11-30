import { SurveyModel } from '@/domain';
import { LoadSurveysRepository } from '@/data';
import { DbLoadSurveys } from './db-load-surveys';

const makeFakeData = () => {
  const surveys: SurveyModel[] = [
    {
      id: 'any_id',
      question: 'any_question',
      answers: [
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
          answer: 'other_answer',
        },
      ],
      date: new Date(),
    },
  ];

  return { surveys };
};

const makeLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    loadAll = (): Promise<SurveyModel[]> => {
      const { surveys } = makeFakeData();
      return Promise.resolve(surveys);
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
    const { surveys } = makeFakeData();

    // Act
    const surveysResult = await sut.load();

    // Assert
    expect(surveysResult).toEqual(surveys);
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
