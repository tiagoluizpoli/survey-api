import { LoadSurveys } from '../../../../domain';
import { ok } from '../../../helpers';
import { Controller, HttpRequest, HttpResponse } from '../../../protocols';

export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveys: LoadSurveys) {}
  handle = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    httpRequest;
    const response = await this.loadSurveys.load();

    return ok(response);
  };
}
