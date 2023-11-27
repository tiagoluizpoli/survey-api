import { AddAccount, Authentication } from '@/domain';
import { Validation } from '../../../protocols';

import { badRequest, forbidden, ok, serverError } from '../../../helpers';
import { Controller, HttpRequest, HttpResponse } from '../../../protocols';
import { AccountAlreadyExistsError } from '../../../errors';

export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication,
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
      if (!account) {
        return forbidden(new AccountAlreadyExistsError());
      }
      const accessToken = await this.authentication.authenticate({
        email,
        password,
      });
      return ok({ accessToken });
    } catch (error) {
      if (error instanceof AccountAlreadyExistsError) {
        return badRequest(error);
      }
      return serverError(error as Error);
    }
  };
}
