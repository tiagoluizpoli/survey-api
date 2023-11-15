import { Controller, HttpRequest, HttpResponse, Validation } from '../../../protocols';

export class AddSurveyController implements Controller {
  constructor(private readonly validation: Validation) {}
  handle = (httpRequest: HttpRequest): Promise<HttpResponse> => {
    httpRequest;

    const httpResponse: HttpResponse = {
      statusCode: 200,
      body: httpRequest.body,
    };

    this.validation.validate(httpRequest.body);
    return Promise.resolve(httpResponse);
  };
}
