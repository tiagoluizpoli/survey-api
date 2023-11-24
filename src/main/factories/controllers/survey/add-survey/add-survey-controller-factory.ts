import { Controller, AddSurveyController } from '../../../../../presentation';
import { makeLogControllerDecorator } from '../../../decorators';
import { makeDbAddSurvey } from '../../../usecases';
import { makeAddSurveyValidation } from './add-survey-validation-factory';

export const makeAddSurveyController = (): Controller => {
  const controller = new AddSurveyController(makeAddSurveyValidation(), makeDbAddSurvey());
  return makeLogControllerDecorator(controller);
};
