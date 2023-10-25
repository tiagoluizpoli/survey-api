import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest, ok } from '../../helpers';
import {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
} from '../../protocols';

export class LoginController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}

  handle = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    if (!httpRequest.body.email) {
      return Promise.resolve(badRequest(new MissingParamError('email')));
    }

    if (!httpRequest.body.password) {
      return Promise.resolve(badRequest(new MissingParamError('password')));
    }

    if (!this.emailValidator.isValid(httpRequest.body.email)) {
      return Promise.resolve(badRequest(new InvalidParamError('email')));
    }

    return Promise.resolve(
      ok({
        message: 'works',
      }),
    );
  };
}
