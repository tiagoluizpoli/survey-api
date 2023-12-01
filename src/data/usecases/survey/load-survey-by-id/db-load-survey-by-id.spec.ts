import { LoadSurveyByIdRepository } from '@/data';
import { DbLoadSurveyById } from './db-load-survey-by-id';

import mockDate from 'mockdate';
import { mockSurveyData } from '@/domain/test';
import { mockLoadSurveyByIdRepository } from '@/data/test';

interface MakeSutResult {
  sut: DbLoadSurveyById;
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository;
}

const makeSut = (): MakeSutResult => {
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository();
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub);

  return { sut, loadSurveyByIdRepositoryStub };
};

describe('DbLoadSurveyById', () => {
  beforeAll(() => {
    mockDate.set(new Date());
  });
  afterAll(() => {
    mockDate.reset();
  });

  it('shoud call LoadSurveyByIdRepository', async () => {
    // Arrange
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById');

    // Act
    await sut.loadById('any_id');

    // Assert
    expect(loadByIdSpy).toHaveBeenCalledWith('any_id');
  });

  it('shoud return a Survey on success', async () => {
    // Arrange
    const { sut } = makeSut();
    const { surveyMock } = mockSurveyData();

    // Act
    const surveysResult = await sut.loadById('any_id');

    // Assert
    expect(surveysResult).toEqual(surveyMock);
  });

  it('shoud throw if LoadSurveyRepository throws', async () => {
    // Arrange
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();

    jest
      .spyOn(loadSurveyByIdRepositoryStub, 'loadById')
      .mockReturnValueOnce(Promise.reject(new Error()));

    // Act
    const promise = sut.loadById('any_id');

    // Assert
    await expect(promise).rejects.toThrow();
  });
});
