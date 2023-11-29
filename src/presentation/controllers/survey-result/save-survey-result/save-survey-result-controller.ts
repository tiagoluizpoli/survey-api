import { LoadSurveyById } from '@/domain';
import { InvalidParamError } from '@/presentation/errors';
import { forbidden, ok, serverError } from '@/presentation/helpers';
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols';

export class SaveSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyById) {}
  handle = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    try {
      const { surveyId } = httpRequest.params;
      const { answer } = httpRequest.body;

      const survey = await this.loadSurveyById.loadById(surveyId);
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'));
      }

      const answers = survey.answers.map((a) => a.answer);
      if (!answers.includes(answer)) {
        return forbidden(new InvalidParamError('answer'));
      }

      return ok({});
    } catch (error) {
      return serverError(error as Error);
    }
  };
}
