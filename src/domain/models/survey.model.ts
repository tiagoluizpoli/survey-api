import { AuditableEntity } from './auditable-entity.model';

export interface SurveyAnswerModel {
  image?: string;
  answer: string;
}

export interface SurveyModel extends AuditableEntity {
  question: string;
  answers: SurveyAnswerModel[];
  date: Date;
}
