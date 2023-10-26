import { EmailValidator, HttpRequest } from '../../protocols';
import { EmailValidation } from '..';
import { InvalidParamError } from '../../errors';

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any@email.com',
    password: 'any_password',
    passwordConfirmation: 'any_password',
  },
});

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      if (email) {
        // eslint-disable-next-line no-console
        console.log(email);
      }
      return true;
    }
  }
  return new EmailValidatorStub();
};

interface MakeSutResult {
  sut: EmailValidation;
  emailValidatorStub: EmailValidator;
}
const makeSut = (): MakeSutResult => {
  const emailValidatorStub = makeEmailValidator();
  const sut = new EmailValidation('email', emailValidatorStub);
  return {
    sut,
    emailValidatorStub,
  };
};

describe('Email Validation', () => {
  it('Shoud return an error if EmailValidator returns false', () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
    const httpResponse = sut.validate(makeFakeRequest().body);
    expect(httpResponse).toEqual(new InvalidParamError('email'));
  });

  it('Shoud call emailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    sut.validate(makeFakeRequest().body);

    expect(isValidSpy).toHaveBeenCalledWith(makeFakeRequest().body.email);
  });

  it('Shoud throw if emailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    const fakeError = new Error();
    fakeError.stack = 'any_stack';
    expect(sut.validate).toThrow();
  });
});
