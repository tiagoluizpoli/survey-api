import { DbAuthentication } from '@/data';
import { Authentication } from '@/domain';
import { AccountMongoRepository, BcryptAdapter, JwtAdapter } from '@/infrastructure';

import { env } from '../../../../config';

export const makeDbAuthentication = (): Authentication => {
  const accountMongoRepository = new AccountMongoRepository();
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  return new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository,
  );
};
