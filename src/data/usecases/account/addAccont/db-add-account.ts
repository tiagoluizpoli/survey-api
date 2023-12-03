import { AddAccountRepository, Hasher, LoadAccountByEmailRepository } from '@/data';
import { AccountModel, AddAccountParams, AddAccount } from '@/domain';

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
  ) {}

  add = async (accountData: AddAccountParams): Promise<AccountModel | null> => {
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
