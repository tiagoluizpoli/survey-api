import { EmailValidatorAdapter } from '../../../../../infrastructure';
import { Validation } from '../../../../../presentation';
import {
  RequiredFieldValidation,
  CompareFildsValidation,
  EmailValidation,
  ValidationComposite,
} from '../../../../../validation';

export const makeSignUpValidation = (): Validation => {
  const validations: Validation[] = [];
  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation'];
  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field));
  }
  validations.push(new CompareFildsValidation('password', 'passwordConfirmation'));

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()));

  return new ValidationComposite(validations);
};
