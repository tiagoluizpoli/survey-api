import { Authentication, AuthenticationParams } from '@/domain';

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    authenticate = (authentication: AuthenticationParams): Promise<string> => {
      authentication;
      return Promise.resolve('any_token');
    };
  }
  return new AuthenticationStub();
};
