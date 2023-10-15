import {
  AccountModel,
  AddAccountModel,
  AddAccount as AddAccountProtocol,
} from '../../../domain';
import { Encrypter } from '../../protocols/encrypter';

export class DbAddAccount implements AddAccountProtocol {
  constructor(private readonly encrypter: Encrypter) {}
  add = async (account: AddAccountModel): Promise<AccountModel> => {
    await this.encrypter.encrypt(account.password);
    return {
      email: '',
      id: '',
      name: '',
      password: '',
    };
  };
}
