import { Validation, InvalidParamError } from '../../presentation';
import { EmailValidator } from '../protocols';

export class EmailValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator,
  ) {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validate = (input: any): Error | null => {
    if (!this.emailValidator.isValid(input[this.fieldName])) {
      return new InvalidParamError(this.fieldName);
    }
    return null;
  };
}
