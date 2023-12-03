import { SaveSurveyResultRepository } from '@/data';
import { SaveSurveyResult, SaveSurveyResultParams, SurveyResultModel } from '@/domain';

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor(private readonly saveSurveyResultRepository: SaveSurveyResultRepository) {}
  save = async (data: SaveSurveyResultParams): Promise<SurveyResultModel> => {
    const surveyResult = await this.saveSurveyResultRepository.save(data);
    return surveyResult;
  };
}
