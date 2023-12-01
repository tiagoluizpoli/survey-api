import { LoadSurveysController } from './load-surveys-controller';
import { LoadSurveys, SurveyModel } from '@/domain';
import mockDate from 'mockdate';
import { noContent, ok, serverError } from '../../../helpers';
import { mockSurveyData } from '@/domain/test';

const makeLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    load = async (): Promise<SurveyModel[]> => {
      const { surveysMock } = mockSurveyData();
      return Promise.resolve(surveysMock);
    };
  }

  return new LoadSurveysStub();
};

interface MakeSutResult {
  sut: LoadSurveysController;
  loadSurveysStub: LoadSurveys;
}
const makeSut = (): MakeSutResult => {
  const loadSurveysStub = makeLoadSurveys();
  const sut = new LoadSurveysController(loadSurveysStub);
  return { sut, loadSurveysStub };
};
describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    mockDate.set(new Date());
  });
  afterAll(() => {
    mockDate.reset();
  });

  it('shoud call LoadSurveys', async () => {
    // Arrange
    const { sut, loadSurveysStub } = makeSut();
    const loadSpy = jest.spyOn(loadSurveysStub, 'load');
    // Act
    await sut.handle({});

    // Assert
    expect(loadSpy).toHaveBeenCalled();
  });

  it('shoud return 200 on success', async () => {
    // Arrange
    const { sut } = makeSut();
    const { surveysMock } = mockSurveyData();
    // Act
    const httpResponse = await sut.handle({});

    // Assert
    expect(httpResponse).toEqual(ok(surveysMock));
  });

  it('shoud return 500 if LoadSurveys throws', async () => {
    // Arrange
    const { sut, loadSurveysStub } = makeSut();
    jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(Promise.reject(new Error()));

    // Act
    const httpResponse = await sut.handle({});

    // Assert
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('shoud return 204 if LoadSorveys return an empty array', async () => {
    // Arrange
    const { sut, loadSurveysStub } = makeSut();
    jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(Promise.resolve([]));

    // Act
    const httpResponse = await sut.handle({});

    // Assert
    expect(httpResponse).toEqual(noContent());
  });
});
