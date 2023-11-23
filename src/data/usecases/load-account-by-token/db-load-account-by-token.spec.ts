import { LoadAccountByToken } from '../../../domain';
import { Decrypter } from '../../protocols';
import { DbLoadAccountByToken } from './db-load-account-by-token';

const makeDecrypter = () => {
  class DecrypterStub implements Decrypter {
    decrypt = (value: string): Promise<string> => {
      value;
      return Promise.resolve('decrypted_token');
    };
  }
  return new DecrypterStub();
};

interface MakeSutResult {
  sut: LoadAccountByToken;
  decrypterStub: Decrypter;
}

const makeSut = (): MakeSutResult => {
  const decrypterStub = makeDecrypter();
  const sut = new DbLoadAccountByToken(decrypterStub);
  return { sut, decrypterStub };
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
});
