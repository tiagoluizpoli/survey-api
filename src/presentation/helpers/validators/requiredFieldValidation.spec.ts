import { MissingParamError } from '../../errors';
import { RequiredFieldValidation } from './requiredFieldValidation';

describe('RequireField Validation', () => {
  it('should return a MissingParamError if valiation fails', () => {
    const sut = new RequiredFieldValidation('field');

    const error = sut.validate({
      name: 'any_value',
    });

    expect(error).toEqual(new MissingParamError('field'));
  });
});
