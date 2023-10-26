import {
  ValidationComposite,
  Validation,
  RequiredFieldValidation,
  CompareFildsValidation,
} from '../../presentation';

export const makeSignUpValidation = (): Validation => {
  const validations: Validation[] = [];
  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation'];
  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field));
  }
  validations.push(
    new CompareFildsValidation('password', 'passwordConfirmation'),
  );
  return new ValidationComposite(validations);
};
