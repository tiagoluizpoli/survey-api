import { AccountModel, AddAccountModel } from '../../../domain';
import { AddAccountRepository, LoadAccountByEmailRepository } from '../../protocols';
import { Hasher } from '../../protocols/criptography/hasher';
import { DbAddAccount } from './dbAddAccount';

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'any@email.com',
  password: 'valid_password',
});

const makeFakeAccountData = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'any@email.com',
  password: 'valid_password',
});

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
      const fakeAccount = makeFakeAccount();
      return Promise.resolve(fakeAccount);
    };
  }

  return new LoadAccountByEmailRepositoryStub();
};

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    add = async (account: AddAccountModel): Promise<AccountModel> => {
      account;

      return await Promise.resolve(makeFakeAccount());
    };
  }
  return new AddAccountRepositoryStub();
};

interface MakeSutResult {
  sut: DbAddAccount;
  hasherStub: Hasher;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
  addAccountRepositoryStub: AddAccountRepository;
}

const makeSut = (): MakeSutResult => {
  const hasherStub = makeHasher();
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const addAccountRepositoryStub = makeAddAccountRepository();

  const sut = new DbAddAccount(
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub,
  );

  return { sut, hasherStub, loadAccountByEmailRepositoryStub, addAccountRepositoryStub };
};

describe('DbAddAccount Usecase', () => {
  it('should call hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut();
    const hashSpy = jest.spyOn(hasherStub, 'hash');

    await sut.add(makeFakeAccountData());

    expect(hashSpy).toHaveBeenCalledWith('valid_password');
  });

  it('should throw if hasher throws', async () => {
    const { sut, hasherStub } = makeSut();
    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(
      new Promise((_, rejects) => {
        return rejects(new Error());
      }),
    );

    const promise = sut.add(makeFakeAccountData());

    await expect(promise).rejects.toThrow();
  });

  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    const loadByEmailSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail');

    const fakeAuthentication = makeFakeAccount();

    await sut.add(fakeAuthentication);

    expect(loadByEmailSpy).toHaveBeenCalledWith('any@email.com');
  });

  it('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(
      new Promise((_, rejects) => {
        return rejects(new Error());
      }),
    );

    const promise = sut.add(makeFakeAccountData());

    await expect(promise).rejects.toThrow();
  });

  it('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(
      new Promise((_, rejects) => {
        return rejects(new Error());
      }),
    );

    const promise = sut.add(makeFakeAccountData());

    await expect(promise).rejects.toThrow();
  });

  it('should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');

    await sut.add(makeFakeAccountData());

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

    const promise = sut.add(makeFakeAccountData());

    await expect(promise).rejects.toThrow();
  });

  it('should return an account on success', async () => {
    const { sut } = makeSut();

    const account = await sut.add(makeFakeAccountData());

    expect(account).toEqual(makeFakeAccount());
  });
});
