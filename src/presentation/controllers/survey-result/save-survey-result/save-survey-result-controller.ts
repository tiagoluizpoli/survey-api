import { LoadSurveyById } from '@/domain';
import { ok } from '@/presentation/helpers';
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols';

export class SaveSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyById) {}
  handle = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    await this.loadSurveyById.loadById(httpRequest.params.surveyId);
    return ok({});
  };
}
