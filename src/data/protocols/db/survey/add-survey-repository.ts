import { AddSurveyModel } from '../../../../domain';

export interface AddSurveyRepository {
  add: (surveyData: AddSurveyModel) => Promise<void>;
}
