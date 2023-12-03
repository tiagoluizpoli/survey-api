import { SaveSurveyResultParams, SurveyResultModel } from '@/domain';

export const mockSurveyResultData = () => {
  const saveSurveyResultMock: SaveSurveyResultParams = {
    accountId: 'any_account_id',
    surveyId: 'any_survey_id',
    date: new Date(),
    answer: 'any_answer',
  };
  const surveyResultMock: SurveyResultModel = {
    id: 'any_id',
    ...saveSurveyResultMock,
  };

  return { surveyResultMock, saveSurveyResultMock };
};
