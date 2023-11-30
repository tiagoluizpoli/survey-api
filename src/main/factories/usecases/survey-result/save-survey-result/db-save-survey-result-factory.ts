import { DbSaveSurveyResult } from '@/data';
import { SaveSurveyResult } from '@/domain';
import { SurveyResultMongoRepository } from '@/infrastructure';

export const makeDbSaveSurveyResult = (): SaveSurveyResult => {
  const surveyMongoResultRepository = new SurveyResultMongoRepository();
  return new DbSaveSurveyResult(surveyMongoResultRepository);
};
