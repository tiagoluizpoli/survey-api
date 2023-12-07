import { LoadSurveyByIdRepository, LoadSurveyResultRepository } from '@/data';
import { mockLoadSurveyByIdRepository, mockLoadSurveyResultRepository } from '@/data/test';
import { LoadSurveyResult } from '@/domain';
import { DbLoadSurveyResult } from './db-load-survey-result';
import { mockSurveyResultData, throwError } from '@/domain/test';
import mockDate from 'mockdate';

interface MakeSutResult {
  sut: LoadSurveyResult;
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository;
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository;
}

const makeSut = (): MakeSutResult => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository();
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository();
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub);
  return { sut, loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub };
};

describe('DbLoadSurveyResult usecase', () => {
  beforeAll(() => {
    mockDate.set(new Date());
  });

  afterAll(() => {
    mockDate.reset();
  });

  it('shoud call LoadSurveyResultRepository with correct surveyId', async () => {
    // Arrange
    const { sut, loadSurveyResultRepositoryStub } = makeSut();
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId');
    // Act
    await sut.load('any_survey_id');

    // Assert
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith('any_survey_id');
  });

  it('shoud throw if LoadSurveyResultRepository throws', async () => {
    // Arrange
    const { sut, loadSurveyResultRepositoryStub } = makeSut();
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockImplementationOnce(throwError);

    // Act
    const promise = sut.load('any_survey_id');

    // Assert
    await expect(promise).rejects.toThrow();
  });

  it('shoud call LoadSurveyByIdRepository if LoadSurveyResultRepository returns undefined', async () => {
    // Arrange
    const { sut, loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub } = makeSut();
    const loadSurveyByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById');
    jest
      .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockReturnValueOnce(Promise.resolve(undefined));
    // Act
    await sut.load('any_survey_id');

    // Assert
    expect(loadSurveyByIdSpy).toHaveBeenCalledWith('any_survey_id');
  });

  it('shoud return surveyResult with all answers with count and percentage 0 if LoadSurveyResultRepository returns undefined', async () => {
    // Arrange
    const { sut, loadSurveyResultRepositoryStub } = makeSut();
    const { surveyResultMock } = mockSurveyResultData();

    jest
      .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockReturnValueOnce(Promise.resolve(undefined));
    // Act
    const surveyResult = await sut.load('any_survey_id');

    // Assert
    expect(surveyResult).toEqual(surveyResultMock);
  });

  it('shoud return the surveyResult on success', async () => {
    // Arrange
    const { sut } = makeSut();
    const { surveyResultMock } = mockSurveyResultData();
    // Act
    const surveyResult = await sut.load('any_survey_id');

    // Assert
    expect(surveyResult).toEqual(surveyResultMock);
  });
});
