import { DbAddAccount } from '../../data';
import { AccountMongoRepository, BcryptAdapter } from '../../infrastructure';

import { SignUpController } from '../../presentation';
import { EmailValidatorAdapter } from '../../utils';
import { LogControllerDecorator } from '../decorators';

export const makeSignUpController = () => {
  const salt = 12;
  const emailValidatorAdapter = new EmailValidatorAdapter();
  const encrypter = new BcryptAdapter(salt);
  const addAccountRepository = new AccountMongoRepository();
  const addAccount = new DbAddAccount(encrypter, addAccountRepository);
  const signUpController = new SignUpController(
    emailValidatorAdapter,
    addAccount,
  );
  return new LogControllerDecorator(signUpController);
};
