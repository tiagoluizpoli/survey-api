import { AddSurveyRepository, LoadSurveyByIdRepository, LoadSurveysRepository } from '@/data';
import { AddSurveyParams, SurveyModel } from '@/domain';
import { mockSurveyData } from '@/domain/test';

export const mockAddSurvayRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    add = async (surveyData: AddSurveyParams): Promise<void> => {
      surveyData;
      return Promise.resolve(undefined);
    };
  }

  return new AddSurveyRepositoryStub();
};

export const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    loadById = (id: string): Promise<SurveyModel> => {
      id;
      const { surveyMock } = mockSurveyData();
      return Promise.resolve(surveyMock);
    };
  }

  return new LoadSurveyByIdRepositoryStub();
};

export const mockLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    loadAll = (): Promise<SurveyModel[]> => {
      const { surveysMock } = mockSurveyData();
      return Promise.resolve(surveysMock);
    };
  }

  return new LoadSurveysRepositoryStub();
};
