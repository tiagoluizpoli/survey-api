import { MissingParamError } from '../../errors';
import { RequiredFieldValidation } from './requiredFieldValidation';

interface MakeSutResult {
  sut: RequiredFieldValidation;
}
const makeSut = (): MakeSutResult => {
  const sut = new RequiredFieldValidation('field');
  return { sut };
};

describe('RequireField Validation', () => {
  it('should return a MissingParamError if valiation fails', () => {
    const { sut } = makeSut();

    const error = sut.validate({
      name: 'any_value',
    });

    expect(error).toEqual(new MissingParamError('field'));
  });

  it('should return a MissingParamError if valiation fails', () => {
    const { sut } = makeSut();

    const error = sut.validate({
      field: 'any_value',
    });

    expect(error).toBeFalsy();
  });
});
