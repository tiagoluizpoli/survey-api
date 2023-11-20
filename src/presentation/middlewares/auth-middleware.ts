import { AccessDeniedError } from '../errors';
import { forbidden } from '../helpers';
import { HttpRequest, HttpResponse } from '../protocols';
import { Middleware } from '../protocols/middleware';

export class AuthMiddleware implements Middleware {
  constructor() {}
  handle = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    httpRequest;
    const error = forbidden(new AccessDeniedError());
    return Promise.resolve(error);
  };
}
