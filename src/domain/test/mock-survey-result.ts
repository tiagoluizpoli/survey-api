import { SaveSurveyResultParams, SurveyResultModel } from '@/domain';

export const mockSurveyResultData = () => {
  const saveSurveyResultMock: SaveSurveyResultParams = {
    accountId: 'any_account_id',
    surveyId: 'any_id',
    date: new Date(),
    answer: 'any_answer 1',
  };
  const surveyResultMock: SurveyResultModel = {
    surveyId: 'any_id',
    question: 'any_question',
    answers: [
      {
        answer: 'any_answer 1',
        count: 0,
        percent: 0,
      },
      {
        answer: 'any_answer 2',
        count: 0,
        percent: 0,
      },
    ],
    date: new Date(),
  };

  return { surveyResultMock, saveSurveyResultMock };
};
