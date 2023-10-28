import { AccountModel } from '../../../domain';
import { LoadAccountByEmailRepository } from '../../protocols';
import { DbAuthentication } from './dbAuthentication';

describe('DbAuthentication UseCase', () => {
  it('should call LoadAccountByEmailRepository with correct email', async () => {
    class LoadAccountByEmailRepositoryStub
      implements LoadAccountByEmailRepository
    {
      load = async (email: string): Promise<AccountModel> => {
        email;
        const account: AccountModel = {
          id: 'any_id',
          name: 'any_name',
          email: 'any@email.com',
          password: 'hashed_password',
        };
        return Promise.resolve(account);
      };
    }
    const loadAccountByEmailRepositoryStub =
      new LoadAccountByEmailRepositoryStub();
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub);

    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load');

    await sut.authenticate({
      email: 'any@email.com',
      password: 'any_password',
    });

    expect(loadSpy).toHaveBeenCalledWith('any@email.com');
  });
});
