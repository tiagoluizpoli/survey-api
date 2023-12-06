import { SaveSurveyResultParams, SurveyResultModel } from '@/domain';

export const mockSurveyResultData = () => {
  const saveSurveyResultMock: SaveSurveyResultParams = {
    accountId: 'any_account_id',
    surveyId: 'any_survey_id',
    date: new Date(),
    answer: 'any_answer',
  };
  const surveyResultMock: SurveyResultModel = {
    surveyId: 'any_survey_id',
    question: 'any_question',
    answers: [
      {
        answer: 'any_answer 1',
        count: 1,
        percent: 50,
      },
      {
        answer: 'any_answer 2',
        count: 1,
        percent: 50,
      },
    ],
    date: new Date(),
  };

  return { surveyResultMock, saveSurveyResultMock };
};
