import { LoadSurveyByIdRepository, LoadSurveyResultRepository } from '@/data';
import { LoadSurveyResult, SurveyResultModel } from '@/domain';
import { mockSurveyResultData } from '@/domain/test';

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor(
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository,
  ) {}
  load = async (surveyId: string): Promise<SurveyResultModel> => {
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId);
    if (!surveyResult) {
      await this.loadSurveyByIdRepository.loadById(surveyId);
    }
    return mockSurveyResultData().surveyResultMock;
  };
}
