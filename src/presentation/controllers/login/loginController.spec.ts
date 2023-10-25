import {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
} from '../../protocols';
import { LoginController } from './loginController';
import { badRequest, serverError } from '../../helpers';
import { InvalidParamError, MissingParamError } from '../../errors';
import { Authentication } from '../../../domain';

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid = (email: string): boolean => {
      email;
      return true;
    };
  }
  return new EmailValidatorStub();
};

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    authenticate = (email: string, password: string): Promise<string> => {
      email;
      password;
      return Promise.resolve('token');
    };
  }
  return new AuthenticationStub();
};

interface MakeSutResult {
  sut: Controller;
  emailValidatorStub: EmailValidator;
  authenticationStub: Authentication;
}
const makeSut = (): MakeSutResult => {
  const emailValidatorStub = makeEmailValidator();
  const authenticationStub = makeAuthentication();
  const sut = new LoginController(emailValidatorStub, authenticationStub);
  return {
    sut,
    emailValidatorStub,
    authenticationStub,
  };
};

interface MakeFakeDataResult {
  httpRequest: HttpRequest;
  noEmailHttpRequest: HttpRequest;
  noPasswordHttpRequest: HttpRequest;
  // fakeResponse: HttpResponse;
}
const makeFakeData = (): MakeFakeDataResult => {
  const httpRequest: HttpRequest = {
    body: {
      email: 'any@email.com',
      password: 'any_password',
    },
  };

  const noPasswordHttpRequest: HttpRequest = {
    body: {
      email: 'any@email.com',
    },
  };

  const noEmailHttpRequest: HttpRequest = {
    body: {
      password: 'any_password',
    },
  };

  return {
    httpRequest,
    noPasswordHttpRequest,
    noEmailHttpRequest,
  };
};

describe('Login Controller', () => {
  it('should return 400 if no email is provided', async () => {
    const { sut } = makeSut();

    const { noEmailHttpRequest } = makeFakeData();

    const httpResponse: HttpResponse = await sut.handle(noEmailHttpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  it('should return 400 if no password is provided', async () => {
    const { sut } = makeSut();

    const { noPasswordHttpRequest } = makeFakeData();

    const httpResponse: HttpResponse = await sut.handle(noPasswordHttpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });

  it('should return 400 if EmailValidator is called with invalid email', async () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const { httpRequest } = makeFakeData();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
  });

  it('should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    const { httpRequest } = makeFakeData();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('should call EmailValidator with a correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    const { httpRequest } = makeFakeData();

    await sut.handle(httpRequest);

    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email);
  });

  it('should call Authentication with a correct values', async () => {
    const { sut, authenticationStub } = makeSut();

    const authenticateSpy = jest.spyOn(authenticationStub, 'authenticate');

    const { httpRequest } = makeFakeData();

    await sut.handle(httpRequest);

    expect(authenticateSpy).toHaveBeenCalledWith(
      httpRequest.body.email,
      httpRequest.body.password,
    );
  });

  it('should call LoginController with valid data', async () => {
    const { sut } = makeSut();

    const sutSpy = jest.spyOn(sut, 'handle');

    const { httpRequest } = makeFakeData();

    await sut.handle(httpRequest);

    expect(sutSpy).toHaveBeenCalledWith(httpRequest);
  });
});
