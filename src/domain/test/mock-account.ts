import { AddAccountParams, AccountModel } from '@/domain';

export const mockAccountData = () => {
  const addAccountMock: AddAccountParams = {
    name: 'any_name',
    email: 'any@email.com',
    password: 'any_password',
  };

  const accountMock: AccountModel = {
    id: 'any_id',
    ...addAccountMock,
  };

  return { addAccountMock, accountMock };
};
