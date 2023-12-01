import { Controller, HttpRequest, Validation } from '../../../protocols';
import { AddSurveyController } from './add-survey-controller';
import { badRequest, noContent, serverError } from '../../../helpers';

import { AddSurvey, AddSurveyParams } from '@/domain';
import mockDate from 'mockdate';
import { mockValidation } from '@/validation/test';
interface MakeFakeDataResult {
  httpRequest: HttpRequest;
}
const makeFakeData = (): MakeFakeDataResult => {
  const httpRequest: HttpRequest = {
    body: {
      question: 'any_question',
      answers: [
        {
          image: 'any_image',
          answer: 'any_answer',
        },
      ],
      date: new Date(),
    },
  };

  return {
    httpRequest,
  };
};

const makeAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    add = async (data: AddSurveyParams): Promise<void> => {
      data;
      return Promise.resolve(undefined);
    };
  }
  return new AddSurveyStub();
};

interface MakeSutResult {
  sut: Controller;
  validationStub: Validation;
  addSurveyStub: AddSurvey;
}

const makeSut = (): MakeSutResult => {
  const validationStub = mockValidation();
  const addSurveyStub = makeAddSurvey();
  const sut = new AddSurveyController(validationStub, addSurveyStub);

  return { sut, validationStub, addSurveyStub };
};

describe('AddSurvey Controller', () => {
  beforeAll(() => {
    mockDate.set(new Date());
  });
  afterAll(() => {
    mockDate.reset();
  });

  it('should call Validation with correct values', async () => {
    //Arrange
    const { sut, validationStub } = makeSut();
    const { httpRequest } = makeFakeData();
    const validationSpy = jest.spyOn(validationStub, 'validate');

    //Act
    await sut.handle(httpRequest);

    //Assert
    expect(validationSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it('shoud return 400 if Validation fails', async () => {
    // Arrange
    const { sut, validationStub } = makeSut();
    const { httpRequest } = makeFakeData();

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error());

    // Act
    const httpResponse = await sut.handle(httpRequest);

    // Assert
    expect(httpResponse).toEqual(badRequest(new Error()));
  });

  it('should call AddSurvey with correct values', async () => {
    //Arrange
    const { sut, addSurveyStub } = makeSut();
    const { httpRequest } = makeFakeData();
    const addSpy = jest.spyOn(addSurveyStub, 'add');

    //Act
    await sut.handle(httpRequest);

    //Assert
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it('should return 500 if AddSurvey throws', async () => {
    //Arrange
    const { sut, addSurveyStub } = makeSut();
    const { httpRequest } = makeFakeData();
    jest.spyOn(addSurveyStub, 'add').mockReturnValueOnce(Promise.reject(new Error()));

    //Act
    const httpResponse = await sut.handle(httpRequest);

    //Assert
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('shoud return 204 on success', async () => {
    // Arrange
    const { sut } = makeSut();
    const { httpRequest } = makeFakeData();

    // Act
    const httpResponse = await sut.handle(httpRequest);

    // Assert
    expect(httpResponse).toEqual(noContent());
  });
});
