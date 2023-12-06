import { LoadSurveyResultRepository } from '@/data';
import { LoadSurveyResult, SurveyResultModel } from '@/domain';
import { mockSurveyResultData } from '@/domain/test';

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor(private readonly loadSurveyResultRepository: LoadSurveyResultRepository) {}
  load = async (surveyId: string): Promise<SurveyResultModel> => {
    await this.loadSurveyResultRepository.loadBySurveyId(surveyId);
    return Promise.resolve(mockSurveyResultData().surveyResultMock);
  };
}
