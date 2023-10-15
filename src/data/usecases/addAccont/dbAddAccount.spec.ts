import { Encrypter } from '../../protocols/encrypter';
import { DbAddAccount } from './dbAddAccount';

interface MakeSutResult {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
}

class EncrypterStub {
  encrypt = async (value: string): Promise<string> => {
    value;
    return await Promise.resolve('hashed_password');
  };
}

const makeEncrypterStub = (): Encrypter => {
  return new EncrypterStub();
};

const makeSut = (): MakeSutResult => {
  const encrypterStub = makeEncrypterStub();

  const sut = new DbAddAccount(encrypterStub);

  return { sut, encrypterStub };
};

describe('DbAddAccount Usecase', () => {
  it('should call encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };
    await sut.add(accountData);

    expect(encryptSpy).toHaveBeenCalledWith('valid_password');
  });
});
