import { Validation, MissingParamError } from '@/presentation';

export class RequiredFieldValidation implements Validation {
  constructor(private readonly fieldName: string) {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validate = (input: any): Error | null => {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName);
    }
    return null;
  };
}
