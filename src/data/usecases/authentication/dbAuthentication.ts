import { Authentication, AuthenticationModel } from '../../../domain';
import { HashComparer, LoadAccountByEmailRepository, TokenGenerator } from '../../protocols';

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator,
  ) {}
  authenticate = async (authentication: AuthenticationModel): Promise<string | null> => {
    const account = await this.loadAccountByEmailRepository.load(authentication.email);
    if (account) {
      await this.hashComparer.compare(authentication.password, account?.password);
      await this.tokenGenerator.generate(account.id);
    }
    return null;
  };
}
