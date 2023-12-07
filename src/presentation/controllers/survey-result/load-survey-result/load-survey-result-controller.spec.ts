import { LoadSurveyById } from '@/domain';
import { Controller, HttpRequest } from '@/presentation/protocols';
import { mockLoadSurveyById } from '@/presentation/test';
import { LoadSurveyResultController } from './load-survey-result-controller';

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
});
