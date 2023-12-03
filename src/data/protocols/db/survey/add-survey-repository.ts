import { AddSurveyParams } from '@/domain';

export interface AddSurveyRepository {
  add: (surveyData: AddSurveyParams) => Promise<void>;
}
