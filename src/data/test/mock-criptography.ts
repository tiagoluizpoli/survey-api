import { Decrypter, Encrypter, HashComparer, Hasher } from '@/data';

export const mockHasher = (): Hasher => {
  class HasherStub implements Hasher {
    hash = async (value: string): Promise<string> => {
      value;
      return await Promise.resolve('hashed_password');
    };
  }
  return new HasherStub();
};

export const mockDecrypter = () => {
  class DecrypterStub implements Decrypter {
    decrypt = (value: string): Promise<string> => {
      value;
      return Promise.resolve('any_token');
    };
  }
  return new DecrypterStub();
};

export const mockEncrypter = (): Encrypter => {
  class encrypterStub implements Encrypter {
    encrypt = async (id: string): Promise<string> => {
      id;
      return Promise.resolve('any_token');
    };
  }

  return new encrypterStub();
};

export const mockHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    compare = async (value: string, hash: string): Promise<boolean> => {
      value;
      hash;
      return Promise.resolve(true);
    };
  }

  return new HashComparerStub();
};
