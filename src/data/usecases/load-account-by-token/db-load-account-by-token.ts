import { AccountModel, LoadAccountByToken } from '../../../domain';
import { Decrypter } from '../../protocols';

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(private readonly decrypter: Decrypter) {}
  load = async (accessToken: string, role?: string | undefined): Promise<AccountModel | null> => {
    accessToken;
    role;
    await this.decrypter.decrypt(accessToken);
    return {
      id: '',
      name: '',
      email: '',
      password: '',
    };
  };
}
