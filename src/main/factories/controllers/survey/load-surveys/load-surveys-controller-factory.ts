import { Controller, LoadSurveysController } from '../../../../../presentation';
import { makeLogControllerDecorator } from '../../../decorators';
import { makeDbLoadSurveys } from '../../../usecases';

export const makeLoadSurveysController = (): Controller => {
  const controller = new LoadSurveysController(makeDbLoadSurveys());
  return makeLogControllerDecorator(controller);
};
