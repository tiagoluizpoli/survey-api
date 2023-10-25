import {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
} from '../../protocols';
import { LoginController } from './loginController';
import { badRequest } from '../../helpers';
import { MissingParamError } from '../../errors';

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid = (email: string): boolean => {
      email;
      return true;
    };
  }
  return new EmailValidatorStub();
};

interface MakeSutResult {
  sut: Controller;
  emailValidatorStub: EmailValidator;
}
const makeSut = (): MakeSutResult => {
  const emailValidatorStub = makeEmailValidator();
  const sut = new LoginController(emailValidatorStub);
  return {
    sut,
    emailValidatorStub,
  };
};

interface MakeFakeDataResult {
  httpRequest: HttpRequest;
  // fakeResponse: HttpResponse;
}
const makeFakeData = (): MakeFakeDataResult => {
  const httpRequest: HttpRequest = {
    body: {
      email: 'any@email.com',
      password: 'any_password',
    },
  };

  return {
    httpRequest,
  };
};

describe('Login Controller', () => {
  it('should return 400 if no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest: HttpRequest = {
      body: {
        password: 'any_password',
      },
    };
    const httpResponse: HttpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });
  it('should return 400 if no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest: HttpRequest = {
      body: {
        email: 'any@email.com',
      },
    };
    const httpResponse: HttpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });

  it('should call EmailValidator with a correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    const { httpRequest } = makeFakeData();

    await sut.handle(httpRequest);

    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email);
  });

  it('should call LoginController with valid data', async () => {
    const { sut } = makeSut();

    const sutSpy = jest.spyOn(sut, 'handle');

    const { httpRequest } = makeFakeData();

    await sut.handle(httpRequest);

    expect(sutSpy).toHaveBeenCalledWith(httpRequest);
  });
});
