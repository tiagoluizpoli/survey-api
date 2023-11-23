import { AccountModel, LoadAccountByToken } from '../../../domain';
import { Decrypter } from '../../protocols';
import { LoadAccountByTokenRepository } from '../../protocols';

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository,
  ) {}
  load = async (accessToken: string, role?: string | undefined): Promise<AccountModel | null> => {
    accessToken;
    role;
    const decryptedToken = await this.decrypter.decrypt(accessToken);
    if (!decryptedToken) {
      return null;
    }

    await this.loadAccountByTokenRepository.loadByToken(decryptedToken, role);
    return {
      id: '',
      name: '',
      email: '',
      password: '',
    };
  };
}
