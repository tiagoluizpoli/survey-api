import { AccountModel, Authentication, AuthenticationParams } from '@/domain';
import {
  HashComparer,
  LoadAccountByEmailRepository,
  Encrypter,
  UpdateAccessTokenRepository,
} from '@/data';
import { DbAuthentication } from './dbAuthentication';
import { mockAccountData } from '@/domain/test';

interface MakeFakeData {
  fakeAuthentication: AuthenticationParams;
}

const makeFakeData = (): MakeFakeData => {
  const fakeAuthentication: AuthenticationParams = {
    email: 'any@email.com',
    password: 'any_password',
  };

  return { fakeAuthentication };
};

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    loadByEmail = async (email: string): Promise<AccountModel | null> => {
      email;
      const { accountMock } = mockAccountData();
      return Promise.resolve(accountMock);
    };
  }

  return new LoadAccountByEmailRepositoryStub();
};

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    compare = async (value: string, hash: string): Promise<boolean> => {
      value;
      hash;
      return Promise.resolve(true);
    };
  }

  return new HashComparerStub();
};

const makeEncrypter = (): Encrypter => {
  class encrypterStub implements Encrypter {
    encrypt = async (id: string): Promise<string> => {
      id;
      return Promise.resolve('any_token');
    };
  }

  return new encrypterStub();
};

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    updateAccessToken = async (id: string, token: string): Promise<void> => {
      id;
      token;
      return Promise.resolve(undefined);
    };
  }

  return new UpdateAccessTokenRepositoryStub();
};

interface MakeSutResult {
  sut: Authentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
  hashComparerStub: HashComparer;
  encrypterStub: Encrypter;
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository;
}
const makeSut = (): MakeSutResult => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const hashComparerStub = makeHashComparer();
  const encrypterStub = makeEncrypter();
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub,
  );
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub,
  };
};

describe('DbAuthentication UseCase', () => {
  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    const loadByEmailSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail');

    const { fakeAuthentication } = makeFakeData();

    await sut.authenticate(fakeAuthentication);

    expect(loadByEmailSpy).toHaveBeenCalledWith('any@email.com');
  });

  it('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(Promise.reject(new Error()));

    const { fakeAuthentication } = makeFakeData();

    const promise = sut.authenticate(fakeAuthentication);

    expect(promise).rejects.toThrow();
  });

  it('should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(Promise.resolve(null));

    const { fakeAuthentication } = makeFakeData();

    const accessToken = await sut.authenticate(fakeAuthentication);

    expect(accessToken).toBeNull();
  });

  it('should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut();

    const compareSpy = jest.spyOn(hashComparerStub, 'compare');

    const { fakeAuthentication } = makeFakeData();
    const { accountMock } = mockAccountData();

    await sut.authenticate(fakeAuthentication);

    expect(compareSpy).toHaveBeenCalledWith(fakeAuthentication.password, accountMock.password);
  });

  it('should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut();

    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(Promise.reject(new Error()));

    const { fakeAuthentication } = makeFakeData();

    const promise = sut.authenticate(fakeAuthentication);

    expect(promise).rejects.toThrow();
  });

  it('should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut();

    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(Promise.resolve(false));

    const { fakeAuthentication } = makeFakeData();

    const accessToken = await sut.authenticate(fakeAuthentication);

    expect(accessToken).toBeNull();
  });

  it('should call Encrypter with correct id', async () => {
    const { sut, encrypterStub } = makeSut();

    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');

    const { fakeAuthentication } = makeFakeData();
    const { accountMock } = mockAccountData();

    await sut.authenticate(fakeAuthentication);

    expect(encryptSpy).toHaveBeenCalledWith(accountMock.id);
  });

  it('should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut();

    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(Promise.reject(new Error()));

    const { fakeAuthentication } = makeFakeData();

    const promise = sut.authenticate(fakeAuthentication);

    expect(promise).rejects.toThrow();
  });

  it('should return a token on success', async () => {
    const { sut } = makeSut();

    const { fakeAuthentication } = makeFakeData();

    const accessToken = await sut.authenticate(fakeAuthentication);

    expect(accessToken).toBe('any_token');
  });

  it('should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();

    const updateAccessTokenSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken');
    const { fakeAuthentication } = makeFakeData();
    const { accountMock } = mockAccountData();

    await sut.authenticate(fakeAuthentication);

    expect(updateAccessTokenSpy).toHaveBeenCalledWith(accountMock.id, 'any_token');
  });

  it('should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();

    jest
      .spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
      .mockReturnValueOnce(Promise.reject(new Error()));

    const { fakeAuthentication } = makeFakeData();

    const promise = sut.authenticate(fakeAuthentication);

    expect(promise).rejects.toThrow();
  });
});
