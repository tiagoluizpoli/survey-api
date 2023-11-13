import {
  Validation,
  RequiredFieldValidation,
  EmailValidation,
  ValidationComposite,
} from '../../../../presentation';
import { EmailValidatorAdapter } from '../../../adapters';

export const makeLoginValidation = (): Validation => {
  const validations: Validation[] = [];
  const requiredFields = ['email', 'password'];
  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field));
  }

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()));

  return new ValidationComposite(validations);
};
