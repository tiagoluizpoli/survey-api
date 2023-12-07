import { SurveyResultModel } from '@/domain';

export interface LoadSurveyResultRepository {
  loadBySurveyId: (surveyId: string) => Promise<SurveyResultModel | undefined>;
}
