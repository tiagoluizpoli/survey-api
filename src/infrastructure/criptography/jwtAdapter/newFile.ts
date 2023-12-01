import jwt from 'jsonwebtoken';
import { throwError } from '@/domain/test';
import { makeSut } from './jwt.adapter.spec';

describe('Jwt Adapter', () => {
  describe('sign()', () => {
    it('should call sign with correct values', async () => {
      const { sut, secret } = makeSut();
      const signSpy = jest.spyOn(jwt, 'sign');
      await sut.encrypt('any_id');

      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, secret);
    });

    it('should return a token on sign success', async () => {
      const { sut } = makeSut();
      const accessToken = await sut.encrypt('any_id');

      expect(accessToken).toBe('any_token');
    });

    it('should throw if sign throws', async () => {
      const { sut } = makeSut();
      jest.spyOn(jwt, 'sign').mockImplementationOnce(throwError);
      const promise = sut.encrypt('any_id');

      await expect(promise).rejects.toThrow();
    });
  });

  describe('verify()', () => {
    it('should call verify with correct values', async () => {
      const { sut, secret } = makeSut();
      const verifySpy = jest.spyOn(jwt, 'verify');
      await sut.decrypt('any_token');

      expect(verifySpy).toHaveBeenCalledWith('any_token', secret);
    });

    it('should return a value on verify success', async () => {
      // Arrange
      const { sut } = makeSut();

      // Act
      const value = await sut.decrypt('any_token');

      // Assert
      expect(value).toBe('any_value');
    });

    it('should throw if verify throws', async () => {
      const { sut } = makeSut();
      jest.spyOn(jwt, 'verify').mockImplementationOnce(throwError);
      const promise = sut.decrypt('any_id');

      await expect(promise).rejects.toThrow();
    });
  });
});
