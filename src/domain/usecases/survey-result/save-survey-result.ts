import { SurveyResultModel } from '@/domain';

export interface SaveSurveyResultParams {
  surveyId: string;
  accountId: string;
  answer: string;
  date: Date;
}

export interface SaveSurveyResult {
  save: (data: SaveSurveyResultParams) => Promise<SurveyResultModel | undefined>;
}
