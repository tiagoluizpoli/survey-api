import { AccountModel } from '../../models/account.model';

export interface AddAccountParams {
  name: string;
  email: string;
  password: string;
}

export interface AddAccount {
  add(account: AddAccountParams): Promise<AccountModel | null>;
}
