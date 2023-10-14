import { InvalidParamError } from '../errors/InvalidParam.error';
import { MissingParamError } from '../errors/missingParam.error';
import { badRequest } from '../helpers/httpHelper';
import { Controller } from '../protocols/controller';
import { EmailValidator } from '../protocols/emailValidator';
import { HttpRequest, HttpResponse } from '../protocols/http';

export class SignUpController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handle = (httpRequest: HttpRequest): HttpResponse => {
    const requiredFields = [
      'name',
      'email',
      'password',
      'passwordConfirmation',
    ];
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }
    if (!this.emailValidator.isValid(httpRequest.body.email)) {
      return badRequest(new InvalidParamError('email'));
    }
    return {
      statusCode: 400,
      body: {
        message: 'success',
      },
    };
  };
}
