import { AccountModel, AddAccountModel, AddAccount as AddAccountProtocol } from '../../../domain';
import { AddAccountRepository, Hasher, LoadAccountByEmailRepository } from '../../protocols';

export class DbAddAccount implements AddAccountProtocol {
  constructor(
    private readonly hasher: Hasher,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly addAccountRepository: AddAccountRepository,
  ) {}

  add = async (accountData: AddAccountModel): Promise<AccountModel> => {
    await this.loadAccountByEmailRepository.loadByEmail(accountData.email);

    const hashedPassword = await this.hasher.hash(accountData.password);

    const account = this.addAccountRepository.add({
      ...accountData,
      password: hashedPassword,
    });
    return account;
  };
}
