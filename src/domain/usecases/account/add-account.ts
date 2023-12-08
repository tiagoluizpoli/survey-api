import { AccountModel } from '@/domain';
import { AddAccountParams } from './account.params';

export interface AddAccount {
  add: (account: AddAccountParams) => Promise<AccountModel | null>;
}
