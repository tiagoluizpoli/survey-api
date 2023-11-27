import { LoadSurveys } from '@/domain';
import { noContent, ok, serverError } from '../../../helpers';
import { Controller, HttpRequest, HttpResponse } from '../../../protocols';

export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveys: LoadSurveys) {}
  handle = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    try {
      httpRequest;
      const surveys = await this.loadSurveys.load();

      return surveys?.length ? ok(surveys) : noContent();
    } catch (error) {
      return serverError(error as Error);
    }
  };
}
