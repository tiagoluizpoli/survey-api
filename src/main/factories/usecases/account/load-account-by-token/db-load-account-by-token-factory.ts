import { DbLoadAccountByToken } from '../../../../../data';
import { LoadAccountByToken } from '../../../../../domain';
import { AccountMongoRepository, JwtAdapter } from '../../../../../infrastructure';
import { env } from '../../../../config';

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  const accoutMongoRepository = new AccountMongoRepository();
  return new DbLoadAccountByToken(jwtAdapter, accoutMongoRepository);
};
