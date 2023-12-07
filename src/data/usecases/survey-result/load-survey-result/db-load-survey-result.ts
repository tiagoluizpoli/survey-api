import { LoadSurveyResultRepository } from '@/data';
import { LoadSurveyResult, SurveyResultModel } from '@/domain';

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor(private readonly loadSurveyResultRepository: LoadSurveyResultRepository) {}
  load = async (surveyId: string): Promise<SurveyResultModel> => {
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId);

    return surveyResult;
  };
}
