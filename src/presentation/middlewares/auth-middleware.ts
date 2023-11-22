import { AccessDeniedError } from '../errors';
import { forbidden, ok } from '../helpers';
import { HttpRequest, HttpResponse } from '../protocols';
import { Middleware } from '../protocols/middleware';
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token';

export class AuthMiddleware implements Middleware {
  constructor(private readonly loadAccountByToken: LoadAccountByToken) {}
  handle = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    httpRequest;
    const accessToken = httpRequest.headers?.['x-access-token'];
    if (!accessToken) {
      const error = forbidden(new AccessDeniedError());
      return Promise.resolve(error);
    }

    const account = await this.loadAccountByToken.load(accessToken);
    return ok(account);
  };
}
