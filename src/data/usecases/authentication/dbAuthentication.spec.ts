import {
  AccountModel,
  Authentication,
  AuthenticationModel,
} from '../../../domain';
import { LoadAccountByEmailRepository } from '../../protocols';
import { DbAuthentication } from './dbAuthentication';

interface MakeFakeData {
  fakeAccount: AccountModel;
  fakeAuthentication: AuthenticationModel;
}

const makeFakeData = (): MakeFakeData => {
  const fakeAccount: AccountModel = {
    id: 'any_id',
    name: 'any_name',
    email: 'any@email.com',
    password: 'hashed_password',
  };

  const fakeAuthentication: AuthenticationModel = {
    email: 'any@email.com',
    password: 'any_password',
  };

  return { fakeAccount, fakeAuthentication };
};

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository
  {
    load = async (email: string): Promise<AccountModel> => {
      email;
      const { fakeAccount } = makeFakeData();
      return Promise.resolve(fakeAccount);
    };
  }

  return new LoadAccountByEmailRepositoryStub();
};

interface MakeSutResult {
  sut: Authentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
}
const makeSut = (): MakeSutResult => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub);
  return { sut, loadAccountByEmailRepositoryStub };
};

describe('DbAuthentication UseCase', () => {
  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load');

    const { fakeAuthentication } = makeFakeData();
    await sut.authenticate(fakeAuthentication);

    expect(loadSpy).toHaveBeenCalledWith('any@email.com');
  });
});