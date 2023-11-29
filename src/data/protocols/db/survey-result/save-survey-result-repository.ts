import { SaveSurveyResultModel, SurveyResultModel } from '@/domain';

export interface SaveSurveyResultRepository {
  save: (data: SaveSurveyResultModel) => Promise<SurveyResultModel>;
}
