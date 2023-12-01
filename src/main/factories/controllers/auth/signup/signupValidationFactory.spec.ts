import { Validation } from '@/presentation';
import {
  RequiredFieldValidation,
  CompareFildsValidation,
  EmailValidation,
  ValidationComposite,
} from '@/validation';
import { makeSignUpValidation } from './signupValidationFactory';
import { mockEmailValidator } from '@/validation/test';

jest.mock('@/validation');

describe('SignupValidation Factory', () => {
  it('should call ValidationComposite with all validations', () => {
    makeSignUpValidation();
    const validations: Validation[] = [];
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation'];
    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(new CompareFildsValidation('password', 'passwordConfirmation'));
    const emailValidatorAdapter = mockEmailValidator();
    validations.push(new EmailValidation('email', emailValidatorAdapter));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
