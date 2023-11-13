import { EmailValidatorAdapter } from '../../../../infrastructure';
import { Validation } from '../../../../presentation';
import {
  RequiredFieldValidation,
  EmailValidation,
  ValidationComposite,
} from '../../../../validation';

export const makeLoginValidation = (): Validation => {
  const validations: Validation[] = [];
  const requiredFields = ['email', 'password'];
  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field));
  }

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()));

  return new ValidationComposite(validations);
};
