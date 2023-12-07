import { LoadSurveyById } from '@/domain';
import { InvalidParamError } from '@/presentation/errors';
import { forbidden, ok } from '@/presentation/helpers';
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols';

export class LoadSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyById) {}
  handle = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    const { surveyId } = httpRequest.params;
    const survey = await this.loadSurveyById.loadById(surveyId);
    if (!survey) {
      return forbidden(new InvalidParamError('surveyId'));
    }
    return Promise.resolve(ok({}));
  };
}
