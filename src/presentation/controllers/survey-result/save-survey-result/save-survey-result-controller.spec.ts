import { HttpRequest, forbidden, serverError } from '@/presentation';
import {
  LoadSurveyById,
  SaveSurveyResult,
  SaveSurveyResultModel,
  SurveyModel,
  SurveyResultModel,
} from '@/domain';
import { SaveSurveyResultController } from './save-survey-result-controller';

import { InvalidParamError } from '@/presentation/errors';

import mockDate from 'mockdate';
interface MakeFakeData {
  httpRequest: HttpRequest;
  survey: SurveyModel;
  saveSurveyResult: SaveSurveyResultModel;
  surveyResult: SurveyResultModel;
}

const makeFakeData = (): MakeFakeData => {
  const httpRequest: HttpRequest = {
    params: {
      surveyId: 'any_survey_id',
    },
    body: {
      answer: 'any_answer',
    },
    accountId: 'any_account_id',
  };

  const survey: SurveyModel = {
    id: 'any_id',
    question: 'any_question',
    answers: [
      {
        answer: 'any_answer',
      },
    ],
    date: new Date(),
  };
  const saveSurveyResult: SaveSurveyResultModel = {
    surveyId: 'any_survey_id',
    accountId: 'any_account_id',
    answer: 'any_answer',
    date: new Date(),
  };
  const surveyResult: SurveyResultModel = {
    id: 'any_id',
    accountId: 'any_account_id',
    surveyId: 'any_survey_id',
    answer: 'any_answer',
    date: new Date(),
  };
  return { httpRequest, survey, saveSurveyResult, surveyResult };
};

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    loadById = (id: string): Promise<SurveyModel> => {
      id;
      const { survey } = makeFakeData();
      return Promise.resolve(survey);
    };
  }

  return new LoadSurveyByIdStub();
};

const makeSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    save = async (data: SaveSurveyResultModel): Promise<SurveyResultModel> => {
      data;
      const { surveyResult } = makeFakeData();
      return Promise.resolve(surveyResult);
    };
  }

  return new SaveSurveyResultStub();
};

interface MakeSutResult {
  sut: SaveSurveyResultController;
  loadSurveyByIdStub: LoadSurveyById;
  saveSurveyResultStub: SaveSurveyResult;
}

const makeSut = (): MakeSutResult => {
  const loadSurveyByIdStub = makeLoadSurveyById();
  const saveSurveyResultStub = makeSaveSurveyResult();

  const sut = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub);
  return { sut, loadSurveyByIdStub, saveSurveyResultStub };
};

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    mockDate.set(new Date());
  });
  afterAll(() => {
    mockDate.reset();
  });
  it('shoud call LoadSurveyById with correct value', async () => {
    // Arrange
    const { sut, loadSurveyByIdStub } = makeSut();
    const { httpRequest } = makeFakeData();

    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById');

    // Act
    await sut.handle(httpRequest);

    // Assert
    expect(loadByIdSpy).toHaveBeenCalledWith(httpRequest.params.surveyId);
  });

  it('shoud return 403 LoadSurveyById returns null', async () => {
    // Arrange
    const { sut, loadSurveyByIdStub } = makeSut();
    const { httpRequest } = makeFakeData();

    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(Promise.resolve(null));

    // Act
    const httpResponse = await sut.handle(httpRequest);

    // Assert
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')));
  });

  it('shoud return 500 if LoadSurveyById throws', async () => {
    // Arrange
    const { sut, loadSurveyByIdStub } = makeSut();
    const { httpRequest } = makeFakeData();
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(Promise.reject(new Error()));

    // Act
    const httpResponse = await sut.handle(httpRequest);

    // Assert
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('shoud return 403 invald answer is provided', async () => {
    // Arrange
    const { sut } = makeSut();

    // Act
    const httpResponse = await sut.handle({
      params: {
        surveyId: 'any_survey_id',
      },
      body: {
        answer: 'wrong_answer',
      },
    });

    // Assert
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')));
  });

  it('shoud call SaveSurveyResult with correct value', async () => {
    // Arrange
    const { sut, saveSurveyResultStub } = makeSut();
    const { httpRequest, saveSurveyResult } = makeFakeData();

    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save');

    // Act
    await sut.handle(httpRequest);

    // Assert
    expect(saveSpy).toHaveBeenCalledWith(saveSurveyResult);
  });
});
