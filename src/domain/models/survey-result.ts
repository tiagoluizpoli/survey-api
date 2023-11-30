import { AuditableEntity } from './auditableEntity';

export interface SurveyResultModel extends AuditableEntity {
  surveyId: string;
  accountId: string;
  answer: string;
  date: Date;
}
