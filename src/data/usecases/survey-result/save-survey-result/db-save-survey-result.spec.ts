import { SaveSurveyResult } from '@/domain';
import { SaveSurveyResultRepository } from '@/data';

import { DbSaveSurveyResult } from './db-save-survey-result';

import mockDate from 'mockdate';
import { mockSurveyResultData } from '@/domain/test';
import { mockSaveSurvayResultRepository } from '@/data/test';

interface MakeSutResult {
  sut: SaveSurveyResult;
  saveSurvayResultRepositoryStub: SaveSurveyResultRepository;
}

const makeSut = (): MakeSutResult => {
  const saveSurvayResultRepositoryStub = mockSaveSurvayResultRepository();
  const sut = new DbSaveSurveyResult(saveSurvayResultRepositoryStub);

  return { sut, saveSurvayResultRepositoryStub };
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
