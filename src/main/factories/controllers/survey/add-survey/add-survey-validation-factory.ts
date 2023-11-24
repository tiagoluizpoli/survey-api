import { Validation } from '../../../../../presentation';
import { RequiredFieldValidation, ValidationComposite } from '../../../../../validation';

export const makeAddSurveyValidation = (): Validation => {
  const validations: Validation[] = [];
  const requiredFields = ['question', 'answers'];
  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field));
  }

  return new ValidationComposite(validations);
};
