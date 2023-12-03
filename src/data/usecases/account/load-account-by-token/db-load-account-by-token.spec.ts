import { LoadAccountByToken } from '@/domain';
import { Decrypter, LoadAccountByTokenRepository } from '@/data';
import { DbLoadAccountByToken } from './db-load-account-by-token';
import { mockAccountData } from '@/domain/test';
import { mockDecrypter, mockLoadAccountByTokenRepository } from '@/data/test';

interface MakeSutResult {
  sut: LoadAccountByToken;
  decrypterStub: Decrypter;
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository;
}

const makeSut = (): MakeSutResult => {
  const decrypterStub = mockDecrypter();
  const loadAccountByTokenRepositoryStub = mockLoadAccountByTokenRepository();
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
    const { accountMock } = mockAccountData();

    // Act
    const accountResult = await sut.load('any_token', 'any_role');

    // Assert
    expect(accountResult).toEqual(accountMock);
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
