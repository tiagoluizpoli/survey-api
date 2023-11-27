import { Controller, SignInController } from '@/presentation';
import { makeLogControllerDecorator } from '../../../decorators';

import { makeDbAuthentication } from '../../../usecases';
import { makeSignInValidation } from './signInValidationFactory';

export const makeLoginController = (): Controller => {
  const controller = new SignInController(makeDbAuthentication(), makeSignInValidation());
  return makeLogControllerDecorator(controller);
};
