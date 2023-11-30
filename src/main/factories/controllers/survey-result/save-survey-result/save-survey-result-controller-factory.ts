import { Controller, SaveSurveyResultController } from '@/presentation';

import {
  makeDbLoadSurveyById,
  makeDbSaveSurveyResult,
  makeLogControllerDecorator,
} from '@/main/factories';

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(
    makeDbLoadSurveyById(),
    makeDbSaveSurveyResult(),
  );
  return makeLogControllerDecorator(controller);
};
