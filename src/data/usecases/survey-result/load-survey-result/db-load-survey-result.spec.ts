import { LoadSurveyResultRepository } from '@/data';
import { mockLoadSurveyResultRepository } from '@/data/test';
import { LoadSurveyResult } from '@/domain';
import { DbLoadSurveyResult } from './db-load-survey-result';
import { mockSurveyResultData, throwError } from '@/domain/test';

interface MakeSutResult {
  sut: LoadSurveyResult;
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository;
}

const makeSut = (): MakeSutResult => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository();
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub);
  return { sut, loadSurveyResultRepositoryStub };
};

describe('DbLoadSurveyResult usecase', () => {
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
