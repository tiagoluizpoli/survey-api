import { MissingParamError } from '../../errors';
import { Validation } from './validation';
import { ValidationComposite } from './validationComposite';

interface MakeSutResult {
  sut: ValidationComposite;
}

class ValidationStub implements Validation {
  validate = (input: unknown): Error | null => {
    input;
    return new MissingParamError('field');
  };
}

const makeSut = (): MakeSutResult => {
  const validationStub = new ValidationStub();
  const sut = new ValidationComposite([validationStub]);
  return { sut };
};

describe('Validation Composite', () => {
  it('should return an Error if any validation fails', () => {
    const { sut } = makeSut();
    const error = sut.validate({
      field: 'any_value',
    });
    expect(error).toEqual(new MissingParamError('field'));
  });
});
