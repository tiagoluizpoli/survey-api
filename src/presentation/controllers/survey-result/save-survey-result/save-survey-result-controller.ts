import { LoadSurveyById } from '@/domain';
import { InvalidParamError } from '@/presentation/errors';
import { forbidden, ok, serverError } from '@/presentation/helpers';
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols';

export class SaveSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyById) {}
  handle = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    try {
      const survey = await this.loadSurveyById.loadById(httpRequest.params.surveyId);
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'));
      }
      return ok({});
    } catch (error) {
      return serverError(error as Error);
    }
  };
}
