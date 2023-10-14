import { HttpRequest, HttpResponse } from '../protocols/http';

export class SignUpController {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handle = (httpRequest: HttpRequest): HttpResponse => {
    if (!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: new Error('Missing param: name'),
      };
    }
    if (!httpRequest.body.email) {
      return {
        statusCode: 400,
        body: new Error('Missing param: email'),
      };
    }
    return {
      statusCode: 400,
      body: {
        message: 'success',
      },
    };
  };
}
