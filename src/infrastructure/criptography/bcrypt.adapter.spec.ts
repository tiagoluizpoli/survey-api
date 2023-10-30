import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt.adapter';
import { Hasher } from '../../data';

jest.mock('bcrypt', () => ({
  hash: async (): Promise<string> => {
    return Promise.resolve('hashed_password');
  },
}));

interface makeSutResult {
  salt: number;
  sut: Hasher;
}

const makeSut = (): makeSutResult => {
  const salt = 12;
  const sut = new BcryptAdapter(salt);
  return { sut, salt };
};

describe('Bcrypt Adapter', () => {
  it('should call bcrypt with correct values', async () => {
    const { sut, salt } = makeSut();

    const hashSpy = jest.spyOn(bcrypt, 'hash');

    await sut.hash('any_value');

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });

  it('should return a hash on success', async () => {
    const { sut } = makeSut();

    const hashedValue = await sut.hash('any_value');

    expect(hashedValue).toBe('hashed_password');
  });

  it('should throw if bcrypt throws', async () => {
    const { sut } = makeSut();
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.hash('any_value');

    await expect(promise).rejects.toThrow();
  });
});
