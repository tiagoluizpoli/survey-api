import { AccountModel, AddAccountModel, AddAccount as AddAccountProtocol } from '@/domain';

import { AddAccountRepository, Hasher, LoadAccountByEmailRepository } from '../../protocols';

export class DbAddAccount implements AddAccountProtocol {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
  ) {}

  add = async (accountData: AddAccountModel): Promise<AccountModel | null> => {
    const account = await this.loadAccountByEmailRepository.loadByEmail(accountData.email);

    if (account) {
      return null;
    }

    const hashedPassword = await this.hasher.hash(accountData.password);

    const newAccount = this.addAccountRepository.add({
      ...accountData,
      password: hashedPassword,
    });
    return newAccount;
  };
}
