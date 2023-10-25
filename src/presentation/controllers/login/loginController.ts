import { MissingParamError } from '../../errors';
import { badRequest, ok } from '../../helpers';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';

export class LoginController implements Controller {
  handle = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    if (!httpRequest.body.email) {
      return Promise.resolve(badRequest(new MissingParamError('email')));
    }
    if (!httpRequest.body.password) {
      return Promise.resolve(badRequest(new MissingParamError('password')));
    }
    return Promise.resolve(
      ok({
        message: 'works',
      }),
    );
  };
}
