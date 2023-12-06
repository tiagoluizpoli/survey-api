import { SurveyResultModel } from '@/domain';

export interface LoadSurveyResult {
  load: (surveyId: string) => Promise<SurveyResultModel>;
}
