import { Validation, InvalidParamLenght } from '@/presentation';

export class RequiredFieldLenghtValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly requiredFieldLength: number,
  ) {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validate = (input: any): Error | null => {
    if (input[this.fieldName].length < this.requiredFieldLength) {
      return new InvalidParamLenght(this.fieldName);
    }
    return null;
  };
}
