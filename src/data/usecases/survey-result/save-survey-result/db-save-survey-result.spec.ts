import { SaveSurveyResult } from '@/domain';
import { LoadSurveyResultRepository, SaveSurveyResultRepository } from '@/data';

import { DbSaveSurveyResult } from './db-save-survey-result';

import mockDate from 'mockdate';
import { mockSurveyResultData, throwError } from '@/domain/test';
import { mockLoadSurveyResultRepository, mockSaveSurvayResultRepository } from '@/data/test';

interface MakeSutResult {
  sut: SaveSurveyResult;
  saveSurvayResultRepositoryStub: SaveSurveyResultRepository;
  loadSurvayResultRepositoryStub: LoadSurveyResultRepository;
}

const makeSut = (): MakeSutResult => {
  const saveSurvayResultRepositoryStub = mockSaveSurvayResultRepository();
  const loadSurvayResultRepositoryStub = mockLoadSurveyResultRepository();
  const sut = new DbSaveSurveyResult(
    saveSurvayResultRepositoryStub,
    loadSurvayResultRepositoryStub,
  );

  return { sut, saveSurvayResultRepositoryStub, loadSurvayResultRepositoryStub };
};

describe('DbSaveSurveyResult UseCase', () => {
  beforeAll(() => {
    mockDate.set(new Date());
  });
  afterAll(() => {
    mockDate.reset();
  });
  it('shoud call SaveSurveyResultRepository with correct values', async () => {
    // Arrange
    const { sut, saveSurvayResultRepositoryStub } = makeSut();
    const { saveSurveyResultMock } = mockSurveyResultData();
    const saveSpy = jest.spyOn(saveSurvayResultRepositoryStub, 'save');

    // Act
    await sut.save(saveSurveyResultMock);

    // Assert
    expect(saveSpy).toHaveBeenCalledWith(saveSurveyResultMock);
  });

  it('should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurvayResultRepositoryStub } = makeSut();
    jest
      .spyOn(saveSurvayResultRepositoryStub, 'save')
      .mockReturnValueOnce(Promise.reject(new Error()));
    const { saveSurveyResultMock } = mockSurveyResultData();

    const promise = sut.save(saveSurveyResultMock);

    await expect(promise).rejects.toThrow();
  });

  it('shoud call LoadSurveyResultRepository with correct values', async () => {
    // Arrange
    const { sut, loadSurvayResultRepositoryStub } = makeSut();
    const { saveSurveyResultMock } = mockSurveyResultData();
    const loadSpy = jest.spyOn(loadSurvayResultRepositoryStub, 'loadBySurveyId');

    // Act
    await sut.save(saveSurveyResultMock);

    // Assert
    expect(loadSpy).toHaveBeenCalledWith(saveSurveyResultMock.surveyId);
  });

  it('should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurvayResultRepositoryStub } = makeSut();
    jest.spyOn(loadSurvayResultRepositoryStub, 'loadBySurveyId').mockImplementationOnce(throwError);
    const { saveSurveyResultMock } = mockSurveyResultData();

    const promise = sut.save(saveSurveyResultMock);

    await expect(promise).rejects.toThrow();
  });

  it('shoud return SurveyResult on success', async () => {
    // Arrange
    const { sut } = makeSut();
    const { saveSurveyResultMock, surveyResultMock } = mockSurveyResultData();

    // Act
    const survey = await sut.save(saveSurveyResultMock);

    // Assert
    expect(survey).toEqual(surveyResultMock);
  });
});
