import {
  ValidationComposite,
  Validation,
  RequiredFieldValidation,
  EmailValidation,
} from '../../../presentation';
import { EmailValidatorAdapter } from '../../adapters';

export const makeLoginValidation = (): Validation => {
  const validations: Validation[] = [];
  const requiredFields = ['name', 'email'];
  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field));
  }

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()));

  return new ValidationComposite(validations);
};
