import { AddSurvey, AddSurveyModel } from '@/domain';
import { DbAddSurvey } from './db-add-survey';
import { AddSurveyRepository } from '../../protocols';
import mockDate from 'mockdate';
interface MakeDataResult {
  surveyData: AddSurveyModel;
}
const makeData = (): MakeDataResult => {
  const surveyData = {
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer',
      },
    ],
    date: new Date(),
  };
  return { surveyData };
};

const makeAddSurvayRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    add = async (surveyData: AddSurveyModel): Promise<void> => {
      surveyData;
      return Promise.resolve(undefined);
    };
  }

  return new AddSurveyRepositoryStub();
};

interface MakeSutResult {
  sut: AddSurvey;
  addSurvayRepositoryStub: AddSurveyRepository;
}

const makeSut = (): MakeSutResult => {
  const addSurvayRepositoryStub = makeAddSurvayRepository();
  const sut = new DbAddSurvey(addSurvayRepositoryStub);

  return { sut, addSurvayRepositoryStub };
};

describe('AddSurvey UseCase', () => {
  beforeAll(() => {
    mockDate.set(new Date());
  });
  afterAll(() => {
    mockDate.reset();
  });
  it('shoud call AddSurveyRepository with correct values', async () => {
    // Arrange
    const { sut, addSurvayRepositoryStub } = makeSut();
    const { surveyData } = makeData();
    const addSpy = jest.spyOn(addSurvayRepositoryStub, 'add');

    // Act
    await sut.add(surveyData);

    // Assert
    expect(addSpy).toHaveBeenCalledWith(surveyData);
  });

  it('should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurvayRepositoryStub } = makeSut();
    jest.spyOn(addSurvayRepositoryStub, 'add').mockReturnValueOnce(
      new Promise((_, rejects) => {
        return rejects(new Error());
      }),
    );
    const { surveyData } = makeData();

    const promise = sut.add(surveyData);

    await expect(promise).rejects.toThrow();
  });
});
