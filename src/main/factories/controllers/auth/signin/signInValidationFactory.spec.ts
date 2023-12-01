import { Validation } from '@/presentation';
import { makeSignInValidation } from './signInValidationFactory';
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '@/validation';
import { mockEmailValidator } from '@/validation/test';

jest.mock('@/validation');

describe('SignInValidation Factory', () => {
  it('should call ValidationComposite with all validations', () => {
    makeSignInValidation();
    const validations: Validation[] = [];

    const requiredFields = ['email', 'password'];

    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field));
    }

    const emailValidatorAdapter = mockEmailValidator();
    validations.push(new EmailValidation('email', emailValidatorAdapter));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
