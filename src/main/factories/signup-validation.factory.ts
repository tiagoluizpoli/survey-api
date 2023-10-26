import {
  ValidationComposite,
  Validation,
  RequiredFieldValidation,
  CompareFildsValidation,
  EmailValidation,
} from '../../presentation';
import { EmailValidatorAdapter } from '../../utils';

export const makeSignUpValidation = (): Validation => {
  const validations: Validation[] = [];
  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation'];
  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field));
  }
  validations.push(
    new CompareFildsValidation('password', 'passwordConfirmation'),
  );

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()));

  return new ValidationComposite(validations);
};
