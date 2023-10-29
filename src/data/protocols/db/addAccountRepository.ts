import { AccountModel, AddAccountModel } from '../../../domain';

export interface AddAccountRepository {
  add: (account: AddAccountModel) => Promise<AccountModel>;
}
