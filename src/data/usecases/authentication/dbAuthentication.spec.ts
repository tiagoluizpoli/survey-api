import { AccountModel, Authentication, AuthenticationModel } from '../../../domain';
import {
  HashComparer,
  LoadAccountByEmailRepository,
  Encrypter,
  UpdateAccessTokenRepository,
} from '../../protocols';
import { DbAuthentication } from './dbAuthentication';

interface MakeFakeData {
  fakeAccount: AccountModel;
  fakeAuthentication: AuthenticationModel;
}

const makeFakeData = (): MakeFakeData => {
  const fakeAccount: AccountModel = {
    id: 'any_id',
    name: 'any_name',
    email: 'any@email.com',
    password: 'hashed_password',
  };

  const fakeAuthentication: AuthenticationModel = {
    email: 'any@email.com',
    password: 'any_password',
  };

  return { fakeAccount, fakeAuthentication };
};

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    load = async (email: string): Promise<AccountModel | null> => {
      email;
      const { fakeAccount } = makeFakeData();
      return Promise.resolve(fakeAccount);
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

    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load');

    const { fakeAuthentication } = makeFakeData();

    await sut.authenticate(fakeAuthentication);

    expect(loadSpy).toHaveBeenCalledWith('any@email.com');
  });

  it('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'load')
      .mockReturnValueOnce(Promise.reject(new Error()));

    const { fakeAuthentication } = makeFakeData();

    const promise = sut.authenticate(fakeAuthentication);

    expect(promise).rejects.toThrow();
  });

  it('should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(Promise.resolve(null));

    const { fakeAuthentication } = makeFakeData();

    const accessToken = await sut.authenticate(fakeAuthentication);

    expect(accessToken).toBeNull();
  });

  it('should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut();

    const compareSpy = jest.spyOn(hashComparerStub, 'compare');

    const { fakeAuthentication, fakeAccount } = makeFakeData();

    await sut.authenticate(fakeAuthentication);

    expect(compareSpy).toHaveBeenCalledWith(fakeAuthentication.password, fakeAccount.password);
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

    const { fakeAuthentication, fakeAccount } = makeFakeData();

    await sut.authenticate(fakeAuthentication);

    expect(encryptSpy).toHaveBeenCalledWith(fakeAccount.id);
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
    const { fakeAuthentication, fakeAccount } = makeFakeData();

    await sut.authenticate(fakeAuthentication);

    expect(updateAccessTokenSpy).toHaveBeenCalledWith(fakeAccount.id, 'any_token');
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
