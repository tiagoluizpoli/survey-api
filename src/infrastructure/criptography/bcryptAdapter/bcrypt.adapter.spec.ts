import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt.adapter';
import { throwError } from '@/domain/test';

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
  describe('hash()', () => {
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

    it('should throw if hash throws', async () => {
      const { sut } = makeSut();
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(throwError);

      const promise = sut.hash('any_value');

      await expect(promise).rejects.toThrow();
    });
  });

  describe('compare()', () => {
    it('should call compare with correct values', async () => {
      const { sut } = makeSut();

      const compareSpy = jest.spyOn(bcrypt, 'compare');

      await sut.compare('any_value', 'any_hash');

      expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash');
    });

    it('should return false when compare fails', async () => {
      const { sut } = makeSut();

      // Making sure the mock is hitting the right overload of the method
      type Compare = (data: string | Buffer, encrypted: string) => Promise<boolean>;
      (
        jest.spyOn(bcrypt, 'compare') as unknown as jest.MockedFunction<Compare>
      ).mockReturnValueOnce(Promise.resolve(false));
      const isValid = await sut.compare('any_value', 'any_hash');

      expect(isValid).toBe(false);
    });

    it('should throw if compare throws', async () => {
      const { sut } = makeSut();
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(throwError);

      const promise = sut.compare('any_value', 'any_hash');

      await expect(promise).rejects.toThrow();
    });
  });
});
