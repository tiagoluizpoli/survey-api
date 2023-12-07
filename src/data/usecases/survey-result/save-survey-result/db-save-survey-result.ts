import { LoadSurveyResultRepository, SaveSurveyResultRepository } from '@/data';
import { SaveSurveyResult, SaveSurveyResultParams, SurveyResultModel } from '@/domain';
import { mockSurveyResultData } from '@/domain/test';

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor(
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
  ) {}
  save = async (data: SaveSurveyResultParams): Promise<SurveyResultModel> => {
    const { surveyId } = data;
    await this.saveSurveyResultRepository.save(data);
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId);
    if (!surveyResult) {
      return mockSurveyResultData().surveyResultMock;
    }
    return surveyResult;
  };
}
