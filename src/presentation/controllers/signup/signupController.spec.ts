import {
  AddAccount,
  AddAccountModel,
  AccountModel,
  Authentication,
  AuthenticationModel,
} from '../../../domain';
import { MissingParamError } from '../../errors';

import { SignUpController } from './signupController';
import { HttpRequest, Validation } from '../../protocols';
import { badRequest, ok, serverError } from '../../helpers';

interface makeFakeDataResult {
  httpRequest: HttpRequest;
  fakeAccount: AccountModel;
}

const makeFakeSignupData = (): makeFakeDataResult => {
  const fakeHttpRequest: HttpRequest = {
    body: {
      name: 'any_name',
      email: 'any@email.com',
      password: 'any_password',
      passwordConfirmation: 'any_password',
    },
  };

  const fakeAccountModel = {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email',
    password: 'valid_password',
  };

  return {
    httpRequest: fakeHttpRequest,
    fakeAccount: fakeAccountModel,
  };
};

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      account;
      const { fakeAccount } = makeFakeSignupData();
      return await Promise.resolve(fakeAccount);
    }
  }
  return new AddAccountStub();
};

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    authenticate = (authentication: AuthenticationModel): Promise<string> => {
      authentication;
      return Promise.resolve('any_token');
    };
  }
  return new AuthenticationStub();
};

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: unknown): Error | null {
      input;
      return null;
    }
  }
  return new ValidationStub();
};

interface MakeSutResult {
  sut: SignUpController;
  addAccountStub: AddAccount;
  validationStub: Validation;
  authenticationStub: Authentication;
}
const makeSut = (): MakeSutResult => {
  const addAccountStub = makeAddAccount();
  const validationStub = makeValidation();
  const authenticationStub = makeAuthentication();

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

  it('Shoud return 200 if valid data is provided', async () => {
    const { sut } = makeSut();
    const { httpRequest, fakeAccount } = makeFakeSignupData();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(ok(fakeAccount));
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
});
