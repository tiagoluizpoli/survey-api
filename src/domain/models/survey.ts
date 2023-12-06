import { AuditableEntity } from './auditableEntity';

interface SurveyAnswerModel {
  image?: string;
  answer: string;
}

export interface SurveyModel extends AuditableEntity {
  question: string;
  answers: SurveyAnswerModel[];
  date: Date;
}
