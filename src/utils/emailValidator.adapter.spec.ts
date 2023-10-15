import { EmailValidatorAdapter } from './emailValidator.adapter';
import validator from 'validator';

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true;
  },
}));

describe('EmailValidator Adapter', () => {
  it('should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter();
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);
    const isValid = sut.isValid('invalidemail.com');
    expect(isValid).toBe(false);
  });

  it('should return true if validator returns true', () => {
    const sut = new EmailValidatorAdapter();
    const isValid = sut.isValid('invalid@email.com');
    expect(isValid).toBe(true);
  });

  it('should return call validator with correct email', () => {
    const sut = new EmailValidatorAdapter();
    const isEmailSpy = jest.spyOn(validator, 'isEmail');
    sut.isValid('any@email.com');
    expect(isEmailSpy).toHaveBeenCalledWith('any@email.com');
  });
});
