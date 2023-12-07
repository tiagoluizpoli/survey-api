import { SaveSurveyResultParams, SurveyResultModel } from '@/domain';
import { mockSurveyResultData } from '@/domain/test';
import { LoadSurveyResultRepository, SaveSurveyResultRepository } from '@/data';

export const mockSaveSurvayResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurvayResultRepositoryStub implements SaveSurveyResultRepository {
    save = async (data: SaveSurveyResultParams): Promise<void> => {
      data;

      return Promise.resolve(undefined);
    };
  }

  return new SaveSurvayResultRepositoryStub();
};

export const mockLoadSurveyResultRepository = (): LoadSurveyResultRepository => {
  class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
    loadBySurveyId = async (surveyId: string): Promise<SurveyResultModel> => {
      surveyId;
      const { surveyResultMock } = mockSurveyResultData();
      return Promise.resolve(surveyResultMock);
    };
  }

  return new LoadSurveyResultRepositoryStub();
};
