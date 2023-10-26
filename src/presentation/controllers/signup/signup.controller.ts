import { AddAccount } from '../../../domain';
import { Validation } from '../../helpers';

import { badRequest, ok, serverError } from '../../helpers/httpHelper';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';

export class SignUpController implements Controller {
  constructor(
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

      const { name, email, password } = httpRequest.body;
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
