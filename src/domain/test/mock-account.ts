import { AddAccountParams, AccountModel } from '@/domain';

interface MockAccountDataResult {
  addAccountMock: AddAccountParams;
  accountMock: AccountModel;
}

export const mockAccountData = (): MockAccountDataResult => {
  const addAccountMock: AddAccountParams = {
    name: 'any_name',
    email: 'any@email.com',
    password: 'any_password',
  };

  const accountMock: AccountModel = {
    id: 'any_id',
    name: 'any_name',
    email: 'any@email.com',
    password: 'any_password',
  };

  return { addAccountMock, accountMock };
};
