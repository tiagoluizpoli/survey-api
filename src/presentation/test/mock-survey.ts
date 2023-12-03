import { AddSurvey, AddSurveyParams, LoadSurveys, SurveyModel } from '@/domain';
import { mockSurveyData } from '@/domain/test';

export const mockAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    add = async (data: AddSurveyParams): Promise<void> => {
      data;
      return Promise.resolve(undefined);
    };
  }
  return new AddSurveyStub();
};

export const mockLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    load = async (): Promise<SurveyModel[]> => {
      const { surveysMock } = mockSurveyData();
      return Promise.resolve(surveysMock);
    };
  }

  return new LoadSurveysStub();
};
