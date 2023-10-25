import { Authentication } from '../../../domain';
import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest, ok, serverError } from '../../helpers';
import {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
} from '../../protocols';

export class LoginController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication,
  ) {}

  handle = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    try {
      const { email, password } = httpRequest.body;
      if (!email) {
        return Promise.resolve(badRequest(new MissingParamError('email')));
      }

      if (!password) {
        return Promise.resolve(badRequest(new MissingParamError('password')));
      }

      if (!this.emailValidator.isValid(email)) {
        return Promise.resolve(badRequest(new InvalidParamError('email')));
      }

      const response = await this.authentication.authenticate(email, password);

      return ok(response);
    } catch (error) {
      return serverError(error as Error);
    }
  };
}
