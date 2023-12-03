import { AuthenticationParams } from '@/domain';

export const mockAutehnticationData = () => {
  const authenticationMock: AuthenticationParams = {
    email: 'any@email.com',
    password: 'any_password',
  };

  return { authenticationMock };
};
