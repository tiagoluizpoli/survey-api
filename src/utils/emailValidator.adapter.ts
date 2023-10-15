import { EmailValidator } from '../presentation/protocols';

export class EmailValidatorAdapter implements EmailValidator {
  constructor() {}
  isValid(email: string): boolean {
    if (email) {
      email;
    }
    return false;
  }
}
