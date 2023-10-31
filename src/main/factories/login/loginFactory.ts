import { DbAuthentication } from '../../../data';
import {
  AccountMongoRepository,
  BcryptAdapter,
  JwtAdapter,
  LogMongoRepository,
} from '../../../infrastructure';

import { Controller, LoginController } from '../../../presentation';
import { env } from '../../config';
import { LogControllerDecorator } from '../../decorators';
import { makeLoginValidation } from './loginValidationFactory';

export const makeLoginController = (): Controller => {
  const accountMongoRepository = new AccountMongoRepository();
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  const dbAuthentication = new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository,
  );

  const loginController = new LoginController(dbAuthentication, makeLoginValidation());
  const logMongoRepository = new LogMongoRepository();
  return new LogControllerDecorator(loginController, logMongoRepository);
};
