import { AddSurveyParams, SurveyModel } from '@/domain';

export const mockSurveyData = () => {
  const addSurveyMock: AddSurveyParams = {
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer',
      },
      {
        image: 'other_image',
        answer: 'other_answer',
      },
    ],
    date: new Date(),
  };

  const addSurveysMock: AddSurveyParams[] = [
    {
      question: 'any_question',
      answers: [
        {
          image: 'any_image',
          answer: 'any_answer',
        },
        {
          answer: 'any_answer',
        },
      ],
      date: new Date(),
    },
    {
      question: 'other_question',
      answers: [
        {
          image: 'other_image',
          answer: 'other_answer',
        },
        {
          answer: 'other_answer',
        },
      ],
      date: new Date(),
    },
  ];

  const surveysMock: SurveyModel[] = [
    {
      id: 'any_id',
      question: 'any_question',
      answers: [
        {
          image: 'any_image',
          answer: 'any_answer',
        },
        {
          answer: 'any_answer',
        },
      ],
      date: new Date(),
    },
    {
      id: 'other_id',
      question: 'other_question',
      answers: [
        {
          image: 'other_image',
          answer: 'other_answer',
        },
        {
          answer: 'other_answer',
        },
      ],
      date: new Date(),
    },
  ];

  const surveyMock: SurveyModel = {
    id: 'any_id',
    question: 'any_question',
    answers: [
      {
        answer: 'any_answer',
      },
    ],
    date: new Date(),
  };

  return { addSurveyMock, addSurveysMock, surveysMock, surveyMock };
};
