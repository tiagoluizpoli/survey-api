import { LoadSurveyById } from '@/domain';
import { ok } from '@/presentation/helpers';
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols';

export class LoadSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyById) {}
  handle = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    const { surveyId } = httpRequest.params;
    await this.loadSurveyById.loadById(surveyId);
    return Promise.resolve(ok({}));
  };
}
