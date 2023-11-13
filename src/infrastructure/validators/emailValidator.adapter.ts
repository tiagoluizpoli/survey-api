import validator from 'validator';
import { EmailValidator } from '../../validation';

export class EmailValidatorAdapter implements EmailValidator {
  constructor() {}
  isValid(email: string): boolean {
    return validator.isEmail(email);
  }
}
