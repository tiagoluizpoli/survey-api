import { MissingParamError } from '../../errors';
import { badRequest } from '../../helpers';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';

export class LoginController implements Controller {
  handle = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    httpRequest;
    return Promise.resolve(badRequest(new MissingParamError('email')));
  };
}
