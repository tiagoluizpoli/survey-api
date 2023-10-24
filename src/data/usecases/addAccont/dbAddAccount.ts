import {
  AccountModel,
  AddAccountModel,
  AddAccount as AddAccountProtocol,
} from '../../../domain';
import { AddAccountRepository, Encrypter } from '../../protocols';

export class DbAddAccount implements AddAccountProtocol {
  constructor(
    private readonly encrypter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository,
  ) {}

  add = async (accountData: AddAccountModel): Promise<AccountModel> => {
    const hashedPassword = await this.encrypter.encrypt(accountData.password);
    const account = this.addAccountRepository.add({
      ...accountData,
      password: hashedPassword,
    });
    return account;
  };
}
