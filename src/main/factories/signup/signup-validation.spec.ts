import {
  CompareFildsValidation,
  EmailValidation,
  EmailValidator,
  RequiredFieldValidation,
  Validation,
  ValidationComposite,
} from '../../../presentation';
import { makeSignUpValidation } from './signup-validation.factory';

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
describe('SignupValidation Factory', () => {
  it('should call ValidationComposite with all validations', () => {
    makeSignUpValidation();
    const validations: Validation[] = [];
    const requiredFields = [
      'name',
      'email',
      'password',
      'passwordConfirmation',
    ];
    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(
      new CompareFildsValidation('password', 'passwordConfirmation'),
    );
    const emailValidatorAdapter = makeEmailValidator();
    validations.push(new EmailValidation('email', emailValidatorAdapter));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
