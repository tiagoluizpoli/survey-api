import { AddSurveyParams, SurveyModel } from '@/domain';

export const mockSurveyData = () => {
  const addSurveyMock: AddSurveyParams = {
    question: 'any_question',
    answers: [
      {
        answer: 'any_answer_1',
        image: 'any_image',
      },
      {
        answer: 'any_answer_2',
        image: 'any_image',
      },
      {
        answer: 'any_answer_3',
        image: 'any_image',
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
        answer: 'any_answer 1',
      },
      {
        answer: 'any_answer 2',
      },
    ],
    date: new Date(),
  };

  return { addSurveyMock, addSurveysMock, surveysMock, surveyMock };
};
