import { LoadSurveyByIdRepository } from '@/data/protocols';
import { SurveyModel } from '@/domain';
import mockDate from 'mockdate';
import { DbLoadSurveyById } from './db-load-survey-by-id';

const makeFakeData = () => {
  const survey = {
    id: 'any_id',
    question: 'any_question',
    answers: [
      {
        answer: 'any_answer',
      },
    ],
    date: new Date(),
  };
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

  return { survey, surveys };
};

const makeLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    loadById = (id: string): Promise<SurveyModel> => {
      id;
      const { survey } = makeFakeData();
      return Promise.resolve(survey);
    };
  }

  return new LoadSurveyByIdRepositoryStub();
};

interface MakeSutResult {
  sut: DbLoadSurveyById;
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository;
}

const makeSut = (): MakeSutResult => {
  const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepository();
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub);

  return { sut, loadSurveyByIdRepositoryStub };
};

describe('DbLoadSurveyById', () => {
  beforeAll(() => {
    mockDate.set(new Date());
  });
  afterAll(() => {
    mockDate.reset();
  });

  it('shoud call LoadSurveyByIdRepository', async () => {
    // Arrange
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById');

    // Act
    await sut.loadById('any_id');

    // Assert
    expect(loadByIdSpy).toHaveBeenCalledWith('any_id');
  });

  it('shoud return a Survey on success', async () => {
    // Arrange
    const { sut } = makeSut();
    const { survey } = makeFakeData();

    // Act
    const surveysResult = await sut.loadById('any_id');

    // Assert
    expect(surveysResult).toEqual(survey);
  });
});
