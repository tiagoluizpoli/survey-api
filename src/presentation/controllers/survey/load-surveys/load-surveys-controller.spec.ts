import { LoadSurveysController } from './load-surveys-controller';
import { LoadSurveys, SurveyModel } from '../../../../domain';
import mockDate from 'mockdate';
import { ok } from '../../../helpers';

const makeFakeData = () => {
  const surveys: SurveyModel[] = [
    {
      id: 'any_id',
      question: 'any_question',
      answers: [
        {
          answer: 'any_answer',
        },
      ],
      date: new Date(),
    },

    {
      id: 'other_id',
      question: 'other_question',
      answers: [
        {
          answer: 'other_answer',
        },
      ],
      date: new Date(),
    },
  ];

  return { surveys };
};

const makeLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    load = async (): Promise<SurveyModel[]> => {
      const { surveys } = makeFakeData();
      return Promise.resolve(surveys);
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
    const { surveys } = makeFakeData();
    // Act
    const httpResponse = await sut.handle({});

    // Assert
    expect(httpResponse).toEqual(ok(surveys));
  });
});
