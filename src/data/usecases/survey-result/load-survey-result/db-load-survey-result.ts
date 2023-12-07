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
      const survey = await this.loadSurveyByIdRepository.loadById(surveyId);

      return {
        surveyId: survey!.id,
        question: survey!.question,
        date: survey!.date,
        answers: survey!.answers.map((answer) => ({ ...answer, count: 0, percent: 0 })),
      };
    }
    return mockSurveyResultData().surveyResultMock;
  };
}
