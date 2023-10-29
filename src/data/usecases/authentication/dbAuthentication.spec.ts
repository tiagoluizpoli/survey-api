import { AccountModel, Authentication, AuthenticationModel } from '../../../domain';
import { HashComparer, LoadAccountByEmailRepository } from '../../protocols';
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

interface MakeSutResult {
  sut: Authentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
  hashComparerStub: HashComparer;
}
const makeSut = (): MakeSutResult => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const hashComparerStub = makeHashComparer();
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub);
  return { sut, loadAccountByEmailRepositoryStub, hashComparerStub };
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

  it('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, hashComparerStub } = makeSut();

    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(Promise.reject(new Error()));

    const { fakeAuthentication } = makeFakeData();

    const promise = sut.authenticate(fakeAuthentication);

    expect(promise).rejects.toThrow();
  });
});
