import { AddSurvey } from '../../../../domain';
import { badRequest, serverError } from '../../../helpers';
import { Controller, HttpRequest, HttpResponse, Validation } from '../../../protocols';

export class AddSurveyController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey,
  ) {}
  handle = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    httpRequest;

    try {
      const error = this.validation.validate(httpRequest.body);
      if (error) {
        return Promise.resolve(badRequest(error));
      }
      const { question, answers } = httpRequest.body;
      await this.addSurvey.add({
        question,
        answers,
      });

      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: httpRequest.body,
      };

      return httpResponse;
    } catch (error) {
      return serverError(error as Error);
    }
  };
}
