import { Validation } from '../../../../../presentation';
import {
  RequiredFieldLenghtValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from '../../../../../validation';
import { makeAddSurveyValidation } from './add-survey-validation-factory';
jest.mock('../../../../../validation');

describe('AddSurveyValidation Factory', () => {
  it('should call ValidationComposite with all validations', () => {
    makeAddSurveyValidation();
    const validations: Validation[] = [];

    const requiredFields = ['question', 'answers'];

    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field));
    }

    validations.push(new RequiredFieldLenghtValidation('fields', 3));

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
