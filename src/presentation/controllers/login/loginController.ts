import { Authentication } from '../../../domain';

import { badRequest, ok, serverError, unauthorized } from '../../helpers';
import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation,
} from '../../protocols';

export class LoginController implements Controller {
  constructor(
    private readonly authentication: Authentication,
    private readonly validation: Validation,
  ) {}

  handle = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    try {
      const error = this.validation.validate(httpRequest.body);
      if (error) {
        return badRequest(error);
      }
      const { email, password } = httpRequest.body;

      const accessToken = await this.authentication.authenticate({
        email,
        password,
      });
      if (!accessToken) {
        return unauthorized();
      }
      return ok({
        accessToken,
      });
    } catch (error) {
      return serverError(error as Error);
    }
  };
}
