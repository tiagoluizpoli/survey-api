import { Authentication } from '@/domain';
import { Validation, Controller, HttpRequest } from '../../../protocols';
import { SignInController } from './signinController';
import { unauthorized, serverError, badRequest, ok } from '../../../helpers';
import { MissingParamError } from '../../../errors';
import { mockAuthentication } from '@/presentation/test';
import { mockValidation } from '@/validation/test';

const mockFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any@email.com',
    password: 'any_password',
    passwordConfirmation: 'any_password',
  },
});

interface MakeSutResult {
  sut: Controller;
  validationStub: Validation;
  authenticationStub: Authentication;
}
const makeSut = (): MakeSutResult => {
  const authenticationStub = mockAuthentication();
  const validationStub = mockValidation();
  const sut = new SignInController(authenticationStub, validationStub);
  return {
    sut,
    validationStub,
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

describe('SignIn Controller', () => {
  it('should call Authentication with a correct values', async () => {
    const { sut, authenticationStub } = makeSut();

    const authenticateSpy = jest.spyOn(authenticationStub, 'authenticate');

    const { httpRequest } = makeFakeData();

    await sut.handle(httpRequest);

    expect(authenticateSpy).toHaveBeenCalledWith({
      email: httpRequest.body.email,
      password: httpRequest.body.password,
    });
  });

  it('should return 401 if invalid credentials provided', async () => {
    const { sut, authenticationStub } = makeSut();

    jest.spyOn(authenticationStub, 'authenticate').mockReturnValueOnce(Promise.resolve(null));

    const { httpRequest } = makeFakeData();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(unauthorized());
  });

  it('should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut();

    jest.spyOn(authenticationStub, 'authenticate').mockReturnValueOnce(Promise.reject(new Error()));

    const { httpRequest } = makeFakeData();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('should call SignInController with valid data', async () => {
    const { sut } = makeSut();

    const { httpRequest } = makeFakeData();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(
      ok({
        accessToken: 'any_token',
      }),
    );
  });

  it('Shoud call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, 'validate');

    const httpRequest = mockFakeRequest();
    await sut.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it('Shoud return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut();
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'));
    const httpResponse = await sut.handle(mockFakeRequest());
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')));
  });
});
