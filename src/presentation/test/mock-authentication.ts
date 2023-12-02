import { Authentication, AuthenticationParams } from '@/domain';

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    authenticate = (authentication: AuthenticationParams): Promise<string> => {
      authentication;
      return Promise.resolve('any_token');
    };
  }
  return new AuthenticationStub();
};

import { AddAccount, AddAccountParams, AccountModel } from '@/domain';
import { mockAccountData } from '@/domain/test';

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountParams): Promise<AccountModel> {
      account;
      const { accountMock } = mockAccountData();
      return await Promise.resolve(accountMock);
    }
  }
  return new AddAccountStub();
};
