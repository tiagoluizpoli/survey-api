import { AuditableEntity } from './auditableEntity';

export interface SurveyAnswerModel {
  image?: string;
  answer: string;
}

export interface SurveyModel extends AuditableEntity {
  question: string;
  answers: SurveyAnswerModel[];
  date: Date;
}
