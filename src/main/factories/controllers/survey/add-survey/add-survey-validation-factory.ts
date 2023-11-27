import { Validation } from '@/presentation';
import {
  RequiredFieldLenghtValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from '@/validation';

export const makeAddSurveyValidation = (): Validation => {
  const validations: Validation[] = [];
  const requiredFields = ['question', 'answers'];
  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field));
  }
  validations.push(new RequiredFieldLenghtValidation('answers', 2));

  return new ValidationComposite(validations);
};
