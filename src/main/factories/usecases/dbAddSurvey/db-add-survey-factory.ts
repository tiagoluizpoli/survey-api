import { DbAddSurvey } from '../../../../data';
import { AddSurvey } from '../../../../domain';
import { SurveyMongoRepository } from '../../../../infrastructure';

export const makeDbAddSurvey = (): AddSurvey => {
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbAddSurvey(surveyMongoRepository);
};
