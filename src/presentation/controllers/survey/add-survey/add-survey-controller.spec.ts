import { Controller, HttpRequest, Validation } from '../../../protocols';
import { AddSurveyController } from './add-survey-controller';

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
    const { sut, validationStub } = makeSut();

    const { httpRequest } = makeFakeData();

    const validationSpy = jest.spyOn(validationStub, 'validate');

    await sut.handle(httpRequest);

    expect(validationSpy).toHaveBeenCalledWith(httpRequest.body);
  });
});
