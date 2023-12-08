import { LoadSurveyResultRepository, SaveSurveyResultRepository } from '@/data';
import { SaveSurveyResult, SaveSurveyResultParams, SurveyResultModel } from '@/domain';

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor(
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
  ) {}
  save = async (data: SaveSurveyResultParams): Promise<SurveyResultModel | undefined> => {
    const { surveyId } = data;
    await this.saveSurveyResultRepository.save(data);
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId);

    return surveyResult;
  };
}
