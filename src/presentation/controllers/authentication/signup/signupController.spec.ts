import { AddAccount, Authentication } from '@/domain';
import { AccountAlreadyExistsError, MissingParamError } from '../../../errors';

import { SignUpController } from './signupController';
import { HttpRequest, Validation } from '../../../protocols';
import { badRequest, forbidden, ok, serverError } from '../../../helpers';

import { mockAddAccount, mockAuthentication } from '@/presentation/test';
import { mockValidation } from '@/validation/test';

interface makeFakeDataResult {
  httpRequest: HttpRequest;
}

const makeFakeSignupData = (): makeFakeDataResult => {
  const httpRequest: HttpRequest = {
    body: {
      name: 'any_name',
      email: 'any@email.com',
      password: 'any_password',
      passwordConfirmation: 'any_password',
    },
  };

  return {
    httpRequest,
  };
};

interface MakeSutResult {
  sut: SignUpController;
  addAccountStub: AddAccount;
  validationStub: Validation;
  authenticationStub: Authentication;
}
const makeSut = (): MakeSutResult => {
  const addAccountStub = mockAddAccount();
  const validationStub = mockValidation();
  const authenticationStub = mockAuthentication();

  const sut = new SignUpController(addAccountStub, validationStub, authenticationStub);
  return {
    sut,
    addAccountStub,
    validationStub,
    authenticationStub,
  };
};

describe('SignUp Controller', () => {
  it('Shoud call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, 'add');
    const { httpRequest } = makeFakeSignupData();

    await sut.handle(httpRequest);

    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any@email.com',
      password: 'any_password',
    });
  });

  it('Shoud return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      return Promise.reject(new Error());
    });
    const { httpRequest } = makeFakeSignupData();

    const httpResponse = await sut.handle(httpRequest);
    const fakeError = new Error();
    fakeError.stack = 'any_stack';
    expect(httpResponse).toEqual(serverError(fakeError));
  });

  it('Shoud return 403 AddAccount returns null', async () => {
    const { sut, addAccountStub } = makeSut();

    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(Promise.resolve(null));
    const { httpRequest } = makeFakeSignupData();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(forbidden(new AccountAlreadyExistsError()));
  });

  it('Shoud return 200 if valid data is provided', async () => {
    const { sut } = makeSut();

    const { httpRequest } = makeFakeSignupData();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }));
  });

  it('Shoud call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, 'validate');

    const { httpRequest } = makeFakeSignupData();
    await sut.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it('Shoud return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut();
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'));

    const { httpRequest } = makeFakeSignupData();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')));
  });

  it('should call Authentication with a correct values', async () => {
    const { sut, authenticationStub } = makeSut();

    const authenticateSpy = jest.spyOn(authenticationStub, 'authenticate');

    const { httpRequest } = makeFakeSignupData();

    await sut.handle(httpRequest);

    expect(authenticateSpy).toHaveBeenCalledWith({
      email: httpRequest.body.email,
      password: httpRequest.body.password,
    });
  });

  it('should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut();

    jest.spyOn(authenticationStub, 'authenticate').mockReturnValueOnce(Promise.reject(new Error()));

    const { httpRequest } = makeFakeSignupData();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
