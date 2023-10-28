import {
  EmailValidation,
  EmailValidator,
  RequiredFieldValidation,
  Validation,
  ValidationComposite,
} from '../../../presentation';
import { makeLoginValidation } from './login-validation.factory';

jest.mock('../../../presentation');

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      if (email) {
        // eslint-disable-next-line no-console
        console.log(email);
      }
      return true;
    }
  }
  return new EmailValidatorStub();
};
describe('LoginValidation Factory', () => {
  it('should call ValidationComposite with all validations', () => {
    makeLoginValidation();
    const validations: Validation[] = [];

    const requiredFields = ['email', 'password'];

    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field));
    }

    const emailValidatorAdapter = makeEmailValidator();
    validations.push(new EmailValidation('email', emailValidatorAdapter));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
