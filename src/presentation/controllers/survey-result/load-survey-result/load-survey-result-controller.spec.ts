import { LoadSurveyById, LoadSurveyResult } from '@/domain';
import { Controller, HttpRequest } from '@/presentation/protocols';
import { mockLoadSurveyById, mockLoadSurveyResult } from '@/presentation/test';
import { LoadSurveyResultController } from './load-survey-result-controller';
import { forbidden, ok, serverError } from '@/presentation/helpers';
import { InvalidParamError } from '@/presentation/errors';
import { mockSurveyResultData, throwError } from '@/domain/test';

const mockData = () => {
  const httpRequest: HttpRequest = {
    params: {
      surveyId: 'any_id',
    },
  };
  return { httpRequest };
};

interface MakeSutResult {
  sut: Controller;
  loadSurveyByIdStub: LoadSurveyById;
  loadSurveyResultStub: LoadSurveyResult;
}
const makeSut = (): MakeSutResult => {
  const loadSurveyByIdStub = mockLoadSurveyById();
  const loadSurveyResultStub = mockLoadSurveyResult();
  const sut = new LoadSurveyResultController(loadSurveyByIdStub, loadSurveyResultStub);
  return { sut, loadSurveyByIdStub, loadSurveyResultStub };
};

describe('LoadSurveyResultController', () => {
  it('shoud call LoadSurvetById with correct value', async () => {
    // Arrange
    const { sut, loadSurveyByIdStub } = makeSut();
    const surveyByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById');
    const { httpRequest } = mockData();

    // Act
    await sut.handle(httpRequest);

    // Assert
    expect(surveyByIdSpy).toHaveBeenCalledWith('any_id');
  });

  it('shoud return 403 if LoadSurvetById returns null', async () => {
    // Arrange
    const { sut, loadSurveyByIdStub } = makeSut();
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(Promise.resolve(null));
    const { httpRequest } = mockData();

    // Act
    const httpResponse = await sut.handle(httpRequest);

    // Assert
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')));
  });

  it('shoud return 500 if LoadSurvetById throws', async () => {
    // Arrange
    const { sut, loadSurveyByIdStub } = makeSut();
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockImplementationOnce(throwError);
    const { httpRequest } = mockData();

    // Act
    const httpResponse = await sut.handle(httpRequest);

    // Assert
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('shoud call LoadSurveyResult with correct value', async () => {
    // Arrange
    const { sut, loadSurveyResultStub } = makeSut();
    const surveyByIdSpy = jest.spyOn(loadSurveyResultStub, 'load');
    const { httpRequest } = mockData();

    // Act
    await sut.handle(httpRequest);

    // Assert
    expect(surveyByIdSpy).toHaveBeenCalledWith('any_id');
  });

  it('shoud return 500 if LoadSurvetById throws', async () => {
    // Arrange
    const { sut, loadSurveyResultStub } = makeSut();
    jest.spyOn(loadSurveyResultStub, 'load').mockImplementationOnce(throwError);
    const { httpRequest } = mockData();

    // Act
    const httpResponse = await sut.handle(httpRequest);

    // Assert
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('shoud return 200 on success', async () => {
    // Arrange
    const { sut } = makeSut();
    const { httpRequest } = mockData();
    const { surveyResultMock } = mockSurveyResultData();

    // Act
    const res = await sut.handle(httpRequest);

    // Assert
    expect(res).toEqual(ok(surveyResultMock));
  });
});
