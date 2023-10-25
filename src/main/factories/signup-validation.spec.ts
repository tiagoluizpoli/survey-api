import {
  RequiredFieldValidation,
  Validation,
  ValidationComposite,
} from '../../presentation';
import { makeSignUpValidation } from './signup-validation.factory';

jest.mock('../../presentation');

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
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
