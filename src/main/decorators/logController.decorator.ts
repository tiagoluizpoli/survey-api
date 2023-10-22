import { Controller, HttpRequest, HttpResponse } from '../../presentation';

export class LogControllerDecorator implements Controller {
  constructor(private readonly controller: Controller) {}
  handle = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    const httpResponse = await this.controller.handle(httpRequest);
    if (httpResponse.statusCode === 500) {
      httpResponse;
    }
    return httpResponse;
  };
}
