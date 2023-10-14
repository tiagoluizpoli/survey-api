import { AddAccount } from '../../../domain';
import { InvalidParamError, MissingParamError } from '../../errors';

import { badRequest, ok, serverError } from '../../helpers/httpHelper';
import {
  EmailValidator,
  Controller,
  HttpRequest,
  HttpResponse,
} from '../../protocols';

export class SignUpController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount,
  ) {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handle = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
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

      const { name, email, password, passwordConfirmation } = httpRequest.body;

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'));
      }

      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'));
      }

      // After all validation / error handlings
      const account = await this.addAccount.add({
        name,
        email,
        password,
      });
      return ok(account);
    } catch (error) {
      return serverError();
    }
  };
}
