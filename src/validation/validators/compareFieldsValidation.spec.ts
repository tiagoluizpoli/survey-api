import { InvalidParamError } from '../../presentation';
import { CompareFildsValidation } from './compareFieldsValidation';

interface MakeSutResult {
  sut: CompareFildsValidation;
}
const makeSut = (): MakeSutResult => {
  const sut = new CompareFildsValidation('field', 'fieldToCompare');
  return { sut };
};

describe('CompareFields Validation', () => {
  it('should return a InvalidParamError if valiation ', () => {
    const { sut } = makeSut();

    const error = sut.validate({
      field: 'any_value',
      fieldToCompare: 'wrong_value',
    });

    expect(error).toEqual(new InvalidParamError('fieldToCompare'));
  });

  it('should return a MissingParamError if valiation fails', () => {
    const { sut } = makeSut();

    const error = sut.validate({
      field: 'any_value',
      fieldToCompare: 'any_value',
    });

    expect(error).toBeFalsy();
  });
});
