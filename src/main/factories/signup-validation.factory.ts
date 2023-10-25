import {
  ValidationComposite,
  Validation,
  RequiredFieldValidation,
} from '../../presentation';

export const makeSignUpValidation = (): Validation => {
  const validations: Validation[] = [];
  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation'];
  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field));
  }
  return new ValidationComposite(validations);
};
