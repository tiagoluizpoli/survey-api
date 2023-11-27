import { Validation, InvalidParamError } from '@/presentation';

export class CompareFildsValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly fieldToCompareName: string,
  ) {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validate = (input: any): Error | null => {
    if (input[this.fieldName] !== input[this.fieldToCompareName]) {
      return new InvalidParamError(this.fieldToCompareName);
    }
    return null;
  };
}
