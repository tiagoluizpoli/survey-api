import {
  LoadSurveyById,
  SurveyModel,
  SaveSurveyResult,
  SaveSurveyResultParams,
  SurveyResultModel,
} from '@/domain';
import { mockSurveyData, mockSurveyResultData } from '@/domain/test';

export const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    loadById = (id: string): Promise<SurveyModel> => {
      id;
      const { surveyMock } = mockSurveyData();
      return Promise.resolve(surveyMock);
    };
  }

  return new LoadSurveyByIdStub();
};

export const mockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    save = async (data: SaveSurveyResultParams): Promise<SurveyResultModel> => {
      data;
      const { surveyResultMock } = mockSurveyResultData();
      return Promise.resolve(surveyResultMock);
    };
  }

  return new SaveSurveyResultStub();
};
