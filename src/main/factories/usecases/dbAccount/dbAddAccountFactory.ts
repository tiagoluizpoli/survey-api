import { DbAddAccount } from '../../../../data';
import { AddAccount } from '../../../../domain';
import { AccountMongoRepository, BcryptAdapter } from '../../../../infrastructure';

export const makeDbAddAccount = (): AddAccount => {
  const salt = 12;
  const hasher = new BcryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();
  return new DbAddAccount(hasher, accountMongoRepository, accountMongoRepository);
};
