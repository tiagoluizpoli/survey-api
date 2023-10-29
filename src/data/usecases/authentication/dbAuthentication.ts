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
      const isValid = await this.hashComparer.compare(authentication.password, account?.password);
      if (isValid) {
        const accessToken = await this.tokenGenerator.generate(account.id);
        return accessToken;
      }
    }
    return null;
  };
}
