import { Controller, HttpRequest, Validation } from '../../../protocols';
import { AddSurveyController } from './add-survey-controller';
import { badRequest } from '../../../helpers/http/httpHelper';

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
    },
  };

  return {
    httpRequest,
  };
};

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate = (input: unknown): Error | null => {
      input;
      return null;
    };
  }
  return new ValidationStub();
};

interface MakeSutResult {
  sut: Controller;
  validationStub: Validation;
}

const makeSut = (): MakeSutResult => {
  const validationStub = makeValidation();
  const sut = new AddSurveyController(validationStub);

  return { sut, validationStub };
};

describe('AddSurvey Controller', () => {
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
});
