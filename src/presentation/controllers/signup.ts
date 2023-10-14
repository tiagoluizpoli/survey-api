import { MissingParamError } from '../errors/missingParam.error';
import { badRequest } from '../helpers/httpHelper';
import { HttpRequest, HttpResponse } from '../protocols/http';

export class SignUpController {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handle = (httpRequest: HttpRequest): HttpResponse => {
    const requiredFields = ['name', 'email'];
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }
    return {
      statusCode: 400,
      body: {
        message: 'success',
      },
    };
  };
}
