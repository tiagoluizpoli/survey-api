import { AddAccount } from '../../../domain';
import { InvalidParamError } from '../../errors';
import { Validation } from '../../helpers';

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
    private readonly validation: Validation,
  ) {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handle = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    try {
      const error = this.validation.validate(httpRequest.body);

      if (error) {
        return badRequest(error);
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
      return serverError(error as Error);
    }
  };
}
