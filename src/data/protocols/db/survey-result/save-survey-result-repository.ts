import { SaveSurveyResultParams, SurveyResultModel } from '@/domain';

export interface SaveSurveyResultRepository {
  save: (data: SaveSurveyResultParams) => Promise<SurveyResultModel>;
}
