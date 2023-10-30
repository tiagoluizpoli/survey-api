import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt.adapter';

jest.mock('bcrypt', () => ({
  hash: async (): Promise<string> => {
    return Promise.resolve('hashed_password');
  },
  compare: async (): Promise<boolean> => {
    return Promise.resolve(true);
  },
}));

interface makeSutResult {
  salt: number;
  sut: BcryptAdapter;
}

const makeSut = (): makeSutResult => {
  const salt = 12;
  const sut = new BcryptAdapter(salt);
  return { sut, salt };
};

describe('Bcrypt Adapter', () => {
  it('should call hash with correct values', async () => {
    const { sut, salt } = makeSut();

    const hashSpy = jest.spyOn(bcrypt, 'hash');

    await sut.hash('any_value');

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });

  it('should return a valid hash on hash success', async () => {
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

  it('should call compare with correct values', async () => {
    const { sut } = makeSut();

    const compareSpy = jest.spyOn(bcrypt, 'compare');

    await sut.compare('any_value', 'any_hash');

    expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash');
  });
});
