import { badRequest } from '../../../helpers';
import { Controller, HttpRequest, HttpResponse, Validation } from '../../../protocols';

export class AddSurveyController implements Controller {
  constructor(private readonly validation: Validation) {}
  handle = (httpRequest: HttpRequest): Promise<HttpResponse> => {
    httpRequest;

    const httpResponse: HttpResponse = {
      statusCode: 200,
      body: httpRequest.body,
    };

    const error = this.validation.validate(httpRequest.body);
    if (error) {
      return Promise.resolve(badRequest(error));
    }
    return Promise.resolve(httpResponse);
  };
}
