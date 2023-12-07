import { LoadSurveyById } from '@/domain';
import { Controller, HttpRequest } from '@/presentation/protocols';
import { mockLoadSurveyById } from '@/presentation/test';
import { LoadSurveyResultController } from './load-survey-result-controller';
import { forbidden, serverError } from '@/presentation/helpers';
import { InvalidParamError } from '@/presentation/errors';
import { throwError } from '@/domain/test';

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
}
const makeSut = (): MakeSutResult => {
  const loadSurveyByIdStub = mockLoadSurveyById();
  const sut = new LoadSurveyResultController(loadSurveyByIdStub);
  return { sut, loadSurveyByIdStub };
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
});
