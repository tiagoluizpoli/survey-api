import { Controller, LoginController } from '../../../../presentation';
import { makeLogControllerDecorator } from '../../decorators';

import { makeDbAuthentication } from '../../usecases';
import { makeLoginValidation } from './loginValidationFactory';

export const makeLoginController = (): Controller => {
  const controller = new LoginController(makeDbAuthentication(), makeLoginValidation());
  return makeLogControllerDecorator(controller);
};
