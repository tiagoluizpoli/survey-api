import { DbLoadSurveyResult } from '@/data';
import { LoadSurveyResult } from '@/domain';
import { SurveyMongoRepository, SurveyResultMongoRepository } from '@/infrastructure';

export const makeDbLoadSurveyResult = (): LoadSurveyResult => {
  const surveyResultMongoRepository = new SurveyResultMongoRepository();
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbLoadSurveyResult(surveyResultMongoRepository, surveyMongoRepository);
};
