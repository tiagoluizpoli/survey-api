import { Validation } from '@/presentation';
import {
  EmailValidator,
  RequiredFieldValidation,
  CompareFildsValidation,
  EmailValidation,
  ValidationComposite,
} from '@/validation';
import { makeSignUpValidation } from './signupValidationFactory';

jest.mock('@/validation');
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
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation'];
    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(new CompareFildsValidation('password', 'passwordConfirmation'));
    const emailValidatorAdapter = makeEmailValidator();
    validations.push(new EmailValidation('email', emailValidatorAdapter));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
