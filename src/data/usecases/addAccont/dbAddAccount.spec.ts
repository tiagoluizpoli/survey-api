import { AccountModel, AddAccountModel, AuthenticationModel } from '../../../domain';
import { MongoHelper } from '../../../infrastructure';

import { AddAccountRepository, LoadAccountByEmailRepository } from '../../protocols';
import { Hasher } from '../../protocols/criptography/hasher';
import { DbAddAccount } from './dbAddAccount';

interface MakeFakeData {
  fakeAddAccountData: AddAccountModel;
  fakeAccount: AccountModel;
  fakeAuthentication: AuthenticationModel;
}

const makeFakeData = (): MakeFakeData => {
  const fakeAddAccountData: AddAccountModel = {
    name: 'valid_name',
    email: 'any@email.com',
    password: 'valid_password',
  };

  const fakeAccount: AccountModel = {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid@email.com',
    password: 'valid_password',
  };

  const fakeAuthentication: AuthenticationModel = {
    email: 'any@email.com',
    password: 'any_password',
  };

  return { fakeAddAccountData, fakeAccount, fakeAuthentication };
};

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    hash = async (value: string): Promise<string> => {
      value;
      return await Promise.resolve('hashed_password');
    };
  }
  return new HasherStub();
};

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    loadByEmail = async (email: string): Promise<AccountModel | null> => {
      email;

      return Promise.resolve(null);
    };
  }

  return new LoadAccountByEmailRepositoryStub();
};

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    add = async (account: AddAccountModel): Promise<AccountModel> => {
      account;

      const { fakeAccount } = makeFakeData();
      return await Promise.resolve(fakeAccount);
    };
  }
  return new AddAccountRepositoryStub();
};

interface MakeSutResult {
  sut: DbAddAccount;
  hasherStub: Hasher;
  addAccountRepositoryStub: AddAccountRepository;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
}

const makeSut = (): MakeSutResult => {
  const hasherStub = makeHasher();

  const addAccountRepositoryStub = makeAddAccountRepository();

  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();

  const sut = new DbAddAccount(
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub,
  );

  return { sut, hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub };
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let accountCollection: any;
describe('DbAddAccount Usecase', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  it('should call hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut();
    const hashSpy = jest.spyOn(hasherStub, 'hash');

    const { fakeAddAccountData } = makeFakeData();
    await sut.add(fakeAddAccountData);

    expect(hashSpy).toHaveBeenCalledWith('valid_password');
  });

  it('should throw if hasher throws', async () => {
    const { sut, hasherStub } = makeSut();
    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(
      new Promise((_, rejects) => {
        return rejects(new Error());
      }),
    );
    const { fakeAddAccountData } = makeFakeData();

    const promise = sut.add(fakeAddAccountData);

    await expect(promise).rejects.toThrow();
  });

  it('should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');

    const { fakeAddAccountData } = makeFakeData();

    await sut.add(fakeAddAccountData);

    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'any@email.com',
      password: 'hashed_password',
    });
  });

  it('should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(
      new Promise((_, rejects) => {
        return rejects(new Error());
      }),
    );
    const { fakeAddAccountData } = makeFakeData();

    const promise = sut.add(fakeAddAccountData);

    await expect(promise).rejects.toThrow();
  });

  it('should return an account on success', async () => {
    const { sut } = makeSut();

    const { fakeAddAccountData, fakeAccount } = makeFakeData();

    const account = await sut.add(fakeAddAccountData);

    expect(account).toEqual(fakeAccount);
  });

  it('should return null if loadAccountByEmailRepository returns an account', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    const { fakeAddAccountData, fakeAccount } = makeFakeData();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(Promise.resolve(fakeAccount));

    const account = await sut.add(fakeAddAccountData);

    expect(account).toBeNull();
  });

  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    const loadByEmailSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail');

    const { fakeAddAccountData } = makeFakeData();

    await sut.add(fakeAddAccountData);

    expect(loadByEmailSpy).toHaveBeenCalledWith(fakeAddAccountData.email);
  });
});
