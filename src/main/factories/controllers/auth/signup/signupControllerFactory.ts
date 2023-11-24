import { SignUpController } from '../../../../../presentation';
import { makeLogControllerDecorator } from '../../../decorators';
import { makeDbAddAccount, makeDbAuthentication } from '../../../usecases';
import { makeSignUpValidation } from './signupValidationFactory';

export const makeSignUpController = () => {
  const controller = new SignUpController(
    makeDbAddAccount(),
    makeSignUpValidation(),
    makeDbAuthentication(),
  );
  return makeLogControllerDecorator(controller);
};
