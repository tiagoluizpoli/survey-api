import { HttpRequest } from '@/presentation/protocols';
import { LoadSurveyById, SurveyModel } from '@/domain';
import { SaveSurveyResultController } from './save-survey-result-controller';
import { forbidden } from '@/presentation/helpers';
import { InvalidParamError } from '@/presentation/errors';

interface MakeFakeData {
  httpRequest: HttpRequest;
  survey: SurveyModel;
}

const makeFakeData = (): MakeFakeData => {
  const httpRequest: HttpRequest = {
    params: {
      surveyId: 'any_survey_id',
    },
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

  return { httpRequest, survey };
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

interface MakeSutResult {
  sut: SaveSurveyResultController;
  loadSurveyByIdStub: LoadSurveyById;
}

const makeSut = (): MakeSutResult => {
  const loadSurveyByIdStub = makeLoadSurveyById();

  const sut = new SaveSurveyResultController(loadSurveyByIdStub);
  return { sut, loadSurveyByIdStub };
};

describe('SaveSurveyResult Controller', () => {
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
});
