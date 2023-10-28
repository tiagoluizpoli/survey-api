import { MissingParamError } from '../../errors';
import { Validation } from './validation';
import { ValidationComposite } from './validationComposite';

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate = (input: unknown): Error | null => {
      input;
      return null;
    };
  }

  return new ValidationStub();
};

interface MakeSutResult {
  sut: ValidationComposite;
  validationStubs: Validation[];
}
const makeSut = (): MakeSutResult => {
  const validationStubs = [makeValidation(), makeValidation()];
  const sut = new ValidationComposite(validationStubs);
  return { sut, validationStubs };
};

describe('Validation Composite', () => {
  it('should return an Error if any validation fails', () => {
    const { sut, validationStubs } = makeSut();
    jest
      .spyOn(validationStubs[1], 'validate')
      .mockReturnValueOnce(new MissingParamError('field'));
    const error = sut.validate({
      field: 'any_value',
    });
    expect(error).toEqual(new MissingParamError('field'));
  });

  it('should return the first Error if more than one validation fails', () => {
    const { sut, validationStubs } = makeSut();
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error());
    jest
      .spyOn(validationStubs[1], 'validate')
      .mockReturnValueOnce(new MissingParamError('field'));
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
