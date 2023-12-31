import { AccessDeniedError } from '../errors';
import { forbidden, ok, serverError } from '../helpers';
import { AuthMiddleware } from './auth-middleware';
import { AccountModel, LoadAccountByToken } from '@/domain';
import { HttpRequest } from '../protocols';
import { mockAccountData } from '@/domain/test';

interface MakeFakeData {
  httpRequest: HttpRequest;
}

const makeFakeData = (): MakeFakeData => {
  const httpRequest: HttpRequest = {
    headers: {
      'x-access-token': 'any_token',
    },
  };

  return { httpRequest };
};

const makeLoadAccountByToken = () => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    constructor() {}
    load = (accessToken: string, role?: string | undefined): Promise<AccountModel | null> => {
      accessToken;
      role;
      const { accountMock } = mockAccountData();
      return Promise.resolve(accountMock);
    };
  }
  return new LoadAccountByTokenStub();
};

interface MakeSutResult {
  sut: AuthMiddleware;
  loadAccountByTokenStub: LoadAccountByToken;
}

const makeSut = (role?: string): MakeSutResult => {
  const loadAccountByTokenStub = makeLoadAccountByToken();
  const sut = new AuthMiddleware(loadAccountByTokenStub, role);
  return { sut, loadAccountByTokenStub };
};

describe('Auth Middleware', () => {
  it('should return 403 if no x-access-token exists in headers', async () => {
    // Arrange
    const { sut } = makeSut();

    // Act
    const httpResponse = await sut.handle({});

    // Assert
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  it('should call LoadAccountByToken with correct accessToken', async () => {
    // Arrange
    const role = 'any_role';
    const { sut, loadAccountByTokenStub } = makeSut(role);
    const { httpRequest } = makeFakeData();

    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load');
    // Act
    await sut.handle(httpRequest);
    // Assert
    expect(loadSpy).toHaveBeenCalledWith('any_token', role);
  });

  it('should return 403 if LoadAccountByToken returns null', async () => {
    // Arrange
    const { sut, loadAccountByTokenStub } = makeSut();
    const { httpRequest } = makeFakeData();

    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(Promise.resolve(null));
    // Act
    const httpResponse = await sut.handle(httpRequest);

    // Assert
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  it('should return 200 if LoadAccountByToken returns an account', async () => {
    // Arrange
    const { sut } = makeSut();
    const { httpRequest } = makeFakeData();
    const { accountMock } = mockAccountData();

    // Act
    const httpResponse = await sut.handle(httpRequest);

    // Assert
    expect(httpResponse).toEqual(
      ok({
        accountId: accountMock.id,
      }),
    );
  });

  it('should return 500 if LoadAccountByToken throws', async () => {
    // Arrange
    const { sut, loadAccountByTokenStub } = makeSut();
    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(Promise.reject(new Error()));

    const { httpRequest } = makeFakeData();

    // Act
    const httpResponse = await sut.handle(httpRequest);

    // Assert
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
