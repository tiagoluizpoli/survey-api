import { AccountModel } from '@/domain';

export interface LoadAccountByEmailRepository {
  loadByEmail: (email: string) => Promise<AccountModel | null>;
}
