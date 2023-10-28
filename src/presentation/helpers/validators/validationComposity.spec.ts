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
  validationStub: Validation;
}
const makeSut = (): MakeSutResult => {
  const validationStub = makeValidation();
  const sut = new ValidationComposite([validationStub]);
  return { sut, validationStub };
};

describe('Validation Composite', () => {
  it('should return an Error if any validation fails', () => {
    const { sut, validationStub } = makeSut();
    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('field'));
    const error = sut.validate({
      field: 'any_value',
    });
    expect(error).toEqual(new MissingParamError('field'));
  });
});
