import { HttpRequest, forbidden, ok, serverError } from '@/presentation';
import { LoadSurveyById, SaveSurveyResult } from '@/domain';
import { SaveSurveyResultController } from './save-survey-result-controller';

import { InvalidParamError } from '@/presentation/errors';

import mockDate from 'mockdate';
import { mockSurveyResultData } from '@/domain/test';
import { mockLoadSurveyById, mockSaveSurveyResult } from '@/presentation/test';
interface MakeFakeData {
  httpRequest: HttpRequest;
}

const makeFakeData = (): MakeFakeData => {
  const httpRequest: HttpRequest = {
    params: {
      surveyId: 'any_id',
    },
    body: {
      answer: 'any_answer 1',
    },
    accountId: 'any_account_id',
  };

  return { httpRequest };
};

interface MakeSutResult {
  sut: SaveSurveyResultController;
  loadSurveyByIdStub: LoadSurveyById;
  saveSurveyResultStub: SaveSurveyResult;
}

const makeSut = (): MakeSutResult => {
  const loadSurveyByIdStub = mockLoadSurveyById();
  const saveSurveyResultStub = mockSaveSurveyResult();

  const sut = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub);
  return { sut, loadSurveyByIdStub, saveSurveyResultStub };
};

describe('SaveSurveyResultController', () => {
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
        surveyId: 'any_id',
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
    const { httpRequest } = makeFakeData();
    const { saveSurveyResultMock } = mockSurveyResultData();

    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save');

    // Act
    await sut.handle(httpRequest);

    // Assert
    expect(saveSpy).toHaveBeenCalledWith(saveSurveyResultMock);
  });

  it('should return 500 if SaveSurveyResult throws', async () => {
    //Arrange
    const { sut, saveSurveyResultStub } = makeSut();
    const { httpRequest } = makeFakeData();
    jest.spyOn(saveSurveyResultStub, 'save').mockReturnValueOnce(Promise.reject(new Error()));

    //Act
    const httpResponse = await sut.handle(httpRequest);

    //Assert
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('shoud return 200 on success', async () => {
    // Arrange
    const { sut } = makeSut();
    const { httpRequest } = makeFakeData();
    const { surveyResultMock } = mockSurveyResultData();

    // Act
    const httpResponse = await sut.handle(httpRequest);

    // Assert
    expect(httpResponse).toEqual(ok(surveyResultMock));
  });
});
