import { EmailValidatorAdapter } from './emailValidator.adapter';

describe('EmailValidator Adapter', () => {
  it('should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter();
    const isValid = sut.isValid('invalid@email.com');
    expect(isValid).toBe(false);
  });
});
