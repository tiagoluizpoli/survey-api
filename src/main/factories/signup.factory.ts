import { DbAddAccount } from '../../data';
import {
  AccountMongoRepository,
  BcryptAdapter,
  LogMongoRepository,
} from '../../infrastructure';

import { SignUpController } from '../../presentation';
import { LogControllerDecorator } from '../decorators';
import { makeSignUpValidation } from './signup-validation.factory';

export const makeSignUpController = () => {
  const salt = 12;
  const encrypter = new BcryptAdapter(salt);
  const addAccountRepository = new AccountMongoRepository();
  const addAccount = new DbAddAccount(encrypter, addAccountRepository);
  const validationComposite = makeSignUpValidation();
  const signUpController = new SignUpController(
    addAccount,
    validationComposite,
  );
  const logMongoRepository = new LogMongoRepository();
  return new LogControllerDecorator(signUpController, logMongoRepository);
};
