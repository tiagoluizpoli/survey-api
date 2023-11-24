import { AccountModel, LoadAccountByToken } from '../../../domain';
import { Decrypter, LoadAccountByTokenRepository } from '../../protocols';
import { DbLoadAccountByToken } from './db-load-account-by-token';

interface MakeFakeData {
  account: AccountModel;
}

const makeFakeData = (): MakeFakeData => {
  const account: AccountModel = {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid@email.com',
    password: 'valid_password',
  };

  return { account };
};

const makeDecrypter = () => {
  class DecrypterStub implements Decrypter {
    decrypt = (value: string): Promise<string> => {
      value;
      return Promise.resolve('any_token');
    };
  }
  return new DecrypterStub();
};

const makeAccountByTokenRepository = () => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    loadByToken = (value: string, role?: string): Promise<AccountModel> => {
      value;
      role;
      const { account } = makeFakeData();
      return Promise.resolve(account);
    };
  }
  return new LoadAccountByTokenRepositoryStub();
};
interface MakeSutResult {
  sut: LoadAccountByToken;
  decrypterStub: Decrypter;
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository;
}

const makeSut = (): MakeSutResult => {
  const decrypterStub = makeDecrypter();
  const loadAccountByTokenRepositoryStub = makeAccountByTokenRepository();
  const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByTokenRepositoryStub);
  return { sut, decrypterStub, loadAccountByTokenRepositoryStub };
};

describe('DbLoadAccountByToken Usecase', () => {
  it('shoud call Decrypter with correct values', async () => {
    // Arrange
    const { sut, decrypterStub } = makeSut();
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt');
    // Act
    await sut.load('any_token');
    // Assert
    expect(decryptSpy).toHaveBeenCalledWith('any_token');
  });

  it('shoud return null if Decrypter return null', async () => {
    // Arrange
    const { sut, decrypterStub } = makeSut();
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(Promise.resolve(null));
    // Act
    const account = await sut.load('any_token', 'any_role');
    // Assert
    expect(account).toBeNull();
  });

  it('shoud call LoadAccountByTokenRepository with correct values', async () => {
    // Arrange
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    const decryptSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken');
    // Act
    await sut.load('any_token', 'any_role');
    // Assert
    expect(decryptSpy).toHaveBeenCalledWith('any_token', 'any_role');
  });

  it('shoud return null if LoadAccountByTokenRepository return null', async () => {
    // Arrange
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
      .mockReturnValueOnce(Promise.resolve(null));
    // Act
    const account = await sut.load('any_token', 'any_role');
    // Assert
    expect(account).toBeNull();
  });

  it('shoud return an account on success', async () => {
    // Arrange
    const { sut } = makeSut();
    const { account } = makeFakeData();

    // Act
    const accountResult = await sut.load('any_token', 'any_role');

    // Assert
    expect(accountResult).toEqual(account);
  });

  it('shoud throw if Decrypter throws', async () => {
    // Arrange
    const { sut, decrypterStub } = makeSut();
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(Promise.reject(new Error()));

    // Act
    const promise = sut.load('any_token', 'any_role');

    // Assert
    await expect(promise).rejects.toThrow();
  });

  it('shoud throw if LoadAccountByTokenRepository throws', async () => {
    // Arrange
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
      .mockReturnValueOnce(Promise.reject(new Error()));

    // Act
    const promise = sut.load('any_token', 'any_role');

    // Assert
    await expect(promise).rejects.toThrow();
  });
});
