import { Validation, MissingParamError } from '@/presentation';
import { ValidationComposite } from './validationComposite';
import { mockValidation } from '@/validation/test';

interface MakeSutResult {
  sut: ValidationComposite;
  validationStubs: Validation[];
}
const makeSut = (): MakeSutResult => {
  const validationStubs = [mockValidation(), mockValidation()];
  const sut = new ValidationComposite(validationStubs);
  return { sut, validationStubs };
};

describe('Validation Composite', () => {
  it('should return an Error if any validation fails', () => {
    const { sut, validationStubs } = makeSut();
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('field'));
    const error = sut.validate({
      field: 'any_value',
    });
    expect(error).toEqual(new MissingParamError('field'));
  });

  it('should return the first Error if more than one validation fails', () => {
    const { sut, validationStubs } = makeSut();
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error());
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('field'));
    const error = sut.validate({
      field: 'any_value',
    });
    expect(error).toEqual(new Error());
  });

  it('should not return if validation succeeds', () => {
    const { sut } = makeSut();

    const error = sut.validate({
      field: 'any_value',
    });
    expect(error).toBeFalsy();
  });
});
