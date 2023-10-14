import { InvalidParamError, MissingParamError } from '../errors';

import { badRequest, serverError } from '../helpers/httpHelper';
import {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
} from '../protocols';

export class SignUpController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handle = (httpRequest: HttpRequest): HttpResponse => {
    try {
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
    } catch (error) {
      return serverError();
    }
  };
}
