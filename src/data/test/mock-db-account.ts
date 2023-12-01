import {
  AddAccountRepository,
  LoadAccountByEmailRepository,
  LoadAccountByTokenRepository,
  UpdateAccessTokenRepository,
} from '@/data';
import { AccountModel, AddAccountParams } from '@/domain';
import { mockAccountData } from '@/domain/test';

export const mockAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    add = async (account: AddAccountParams): Promise<AccountModel> => {
      account;

      const { accountMock } = mockAccountData();
      return await Promise.resolve(accountMock);
    };
  }
  return new AddAccountRepositoryStub();
};

export const mockSuccessLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    loadByEmail = async (email: string): Promise<AccountModel | null> => {
      email;
      const { accountMock } = mockAccountData();
      return Promise.resolve(accountMock);
    };
  }

  return new LoadAccountByEmailRepositoryStub();
};

export const mockNullLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    loadByEmail = async (email: string): Promise<AccountModel | null> => {
      email;

      return Promise.resolve(null);
    };
  }

  return new LoadAccountByEmailRepositoryStub();
};

export const mockLoadAccountByTokenRepository = () => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    loadByToken = (value: string, role?: string): Promise<AccountModel> => {
      value;
      role;
      const { accountMock } = mockAccountData();
      return Promise.resolve(accountMock);
    };
  }
  return new LoadAccountByTokenRepositoryStub();
};

export const mockUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    updateAccessToken = async (id: string, token: string): Promise<void> => {
      id;
      token;
      return Promise.resolve(undefined);
    };
  }

  return new UpdateAccessTokenRepositoryStub();
};
