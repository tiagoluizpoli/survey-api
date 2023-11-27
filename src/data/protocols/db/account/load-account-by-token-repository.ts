import { AccountModel } from '@/domain';

export interface LoadAccountByTokenRepository {
  loadByToken: (token: string, role?: string) => Promise<AccountModel | null>;
}
