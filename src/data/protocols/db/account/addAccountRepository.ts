import { AccountModel, AddAccountParams } from '@/domain';

export interface AddAccountRepository {
  add: (account: AddAccountParams) => Promise<AccountModel>;
}
