import { AccountModel } from '../../../domain';

export interface LoadAccountByEmailRepository {
  load: (email: string) => Promise<AccountModel | null>;
}
