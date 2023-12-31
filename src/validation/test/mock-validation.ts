import { Validation } from '@/presentation';
import { EmailValidator } from '@/validation';

export const mockEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      email;
      return true;
    }
  }
  return new EmailValidatorStub();
};

export const mockValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate = (input: unknown): Error | null => {
      input;
      return null;
    };
  }

  return new ValidationStub();
};
