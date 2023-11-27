import { InvalidParamLenght } from '@/presentation';
import { RequiredFieldLenghtValidation } from './requiredFieldLenghtValidation';

interface MakeSutResult {
  sut: RequiredFieldLenghtValidation;
}
const makeSut = (): MakeSutResult => {
  const sut = new RequiredFieldLenghtValidation('fields', 2);
  return { sut };
};

describe('RequireField Validation', () => {
  it('should return a InvalidParamLenght if valiation fails', () => {
    const { sut } = makeSut();

    const error = sut.validate({
      fields: ['any_value_1'],
    });

    expect(error).toEqual(new InvalidParamLenght('fields'));
  });
});
