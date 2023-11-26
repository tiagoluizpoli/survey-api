import { LoadSurveys } from '../../../../domain';
import { ok, serverError } from '../../../helpers';
import { Controller, HttpRequest, HttpResponse } from '../../../protocols';

export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveys: LoadSurveys) {}
  handle = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    try {
      httpRequest;
      const response = await this.loadSurveys.load();

      return ok(response);
    } catch (error) {
      return serverError(error as Error);
    }
  };
}
