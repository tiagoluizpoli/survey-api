import { Authentication, AuthenticationModel } from '../../../domain';
import { LoadAccountByEmailRepository } from '../../protocols';

export class DbAuthentication implements Authentication {
  constructor(private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository) {}
  authenticate = async (authentication: AuthenticationModel): Promise<string | null> => {
    await this.loadAccountByEmailRepository.load(authentication.email);
    return null;
  };
}
