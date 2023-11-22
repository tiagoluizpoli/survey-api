import { AccessDeniedError } from '../errors';
import { forbidden } from '../helpers';
import { AuthMiddleware } from './auth-middleware';
import { AccountModel, LoadAccountByToken } from '../../domain';

interface MakeFakeData {
  fakeAccount: AccountModel;
}

const makeFakeData = (): MakeFakeData => {
  const fakeAccount: AccountModel = {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid@email.com',
    password: 'hashed_password',
    accessToken: 'valid_access_token',
  };

  return { fakeAccount };
};

const makeLoadAccountByToken = () => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    constructor() {}
    load = (accessToken: string, role?: string | undefined): Promise<AccountModel | null> => {
      accessToken;
      role;
      const { fakeAccount } = makeFakeData();
      return Promise.resolve(fakeAccount);
    };
  }
  return new LoadAccountByTokenStub();
};

interface MakeSutResult {
  sut: AuthMiddleware;
  loadAccountByTokenStub: LoadAccountByToken;
}

const makeSut = (): MakeSutResult => {
  const loadAccountByTokenStub = makeLoadAccountByToken();
  const sut = new AuthMiddleware(loadAccountByTokenStub);
  return { sut, loadAccountByTokenStub };
};

describe('Auth Middleware', () => {
  it('should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  it('should call LoadAccountByToken with correct accessToken', async () => {
    // Arrange
    const { sut, loadAccountByTokenStub } = makeSut();

    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load');
    // Act
    await sut.handle({
      headers: {
        'x-access-token': 'any_token',
      },
    });
    // Assert
    expect(loadSpy).toHaveBeenCalledWith('any_token');
  });
});
