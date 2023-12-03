import { SurveyAnswerModel } from '../../models';

export interface AddSurveyParams {
  question: string;
  answers: SurveyAnswerModel[];
  date: Date;
}

export interface AddSurvey {
  add(data: AddSurveyParams): Promise<void>;
}
