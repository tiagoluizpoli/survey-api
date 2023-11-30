import { AccountModel, LoadAccountByToken } from '@/domain';
import { LoadAccountByTokenRepository, Decrypter } from '@/data';

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository,
  ) {}
  load = async (accessToken: string, role?: string): Promise<AccountModel | null> => {
    accessToken;
    role;
    const decryptedToken = await this.decrypter.decrypt(accessToken);
    if (!decryptedToken) {
      return null;
    }

    const account = await this.loadAccountByTokenRepository.loadByToken(accessToken, role);

    if (!account) {
      return null;
    }
    return account;
  };
}
