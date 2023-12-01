import { SaveSurveyResult, SaveSurveyResultParams, SurveyResultModel } from '@/domain';
import { SaveSurveyResultRepository } from '@/data';

import { DbSaveSurveyResult } from './db-save-survey-result';

import mockDate from 'mockdate';

interface MakeDataResult {
  surveyResult: SurveyResultModel;
  saveSurveyResult: SaveSurveyResultParams;
}
const makeData = (): MakeDataResult => {
  const saveSurveyResult: SaveSurveyResultParams = {
    accountId: 'any_id',
    surveyId: 'any_survey_id',
    date: new Date(),
    answer: 'any_answer',
  };
  const surveyResult: SurveyResultModel = {
    id: 'any_id',
    ...saveSurveyResult,
  };

  return { surveyResult, saveSurveyResult };
};

const makeSaveSurvayResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurvayResultRepositoryStub implements SaveSurveyResultRepository {
    save = async (data: SaveSurveyResultParams): Promise<SurveyResultModel> => {
      data;
      const { surveyResult } = makeData();
      return Promise.resolve(surveyResult);
    };
  }

  return new SaveSurvayResultRepositoryStub();
};

interface MakeSutResult {
  sut: SaveSurveyResult;
  saveSurvayResultRepositoryStub: SaveSurveyResultRepository;
}

const makeSut = (): MakeSutResult => {
  const saveSurvayResultRepositoryStub = makeSaveSurvayResultRepository();
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
    const { saveSurveyResult } = makeData();
    const saveSpy = jest.spyOn(saveSurvayResultRepositoryStub, 'save');

    // Act
    await sut.save(saveSurveyResult);

    // Assert
    expect(saveSpy).toHaveBeenCalledWith(saveSurveyResult);
  });

  it('should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurvayResultRepositoryStub } = makeSut();
    jest.spyOn(saveSurvayResultRepositoryStub, 'save').mockReturnValueOnce(
      new Promise((_, rejects) => {
        return rejects(new Error());
      }),
    );
    const { saveSurveyResult } = makeData();

    const promise = sut.save(saveSurveyResult);

    await expect(promise).rejects.toThrow();
  });

  it('shoud return SurveyResult on success', async () => {
    // Arrange
    const { sut } = makeSut();
    const { saveSurveyResult, surveyResult } = makeData();

    // Act
    const survey = await sut.save(saveSurveyResult);

    // Assert
    expect(survey).toEqual(surveyResult);
  });
});
