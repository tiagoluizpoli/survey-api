import { LogErrorRepository } from '@/data';
import { Controller, HttpRequest, HttpResponse } from '@/presentation';

export class LogControllerDecorator implements Controller {
  constructor(
    private readonly controller: Controller,
    private readonly logErrorRepository: LogErrorRepository,
  ) {}
  handle = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    const httpResponse = await this.controller.handle(httpRequest);
    if (httpResponse.statusCode === 500) {
      await this.logErrorRepository.logError(httpResponse.body.stack);
    }
    return httpResponse;
  };
}
