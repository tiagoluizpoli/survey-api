import { SaveSurveyResultParams, SurveyResultModel } from '@/domain';
import { mockSurveyResultData } from '@/domain/test';
import { SaveSurveyResultRepository } from '@/data';

export const mockSaveSurvayResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurvayResultRepositoryStub implements SaveSurveyResultRepository {
    save = async (data: SaveSurveyResultParams): Promise<SurveyResultModel> => {
      data;
      const { surveyResultMock } = mockSurveyResultData();
      return Promise.resolve(surveyResultMock);
    };
  }

  return new SaveSurvayResultRepositoryStub();
};
