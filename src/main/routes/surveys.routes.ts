import { Router } from 'express';
import { adaptRoute } from '../adapters/express/expressRoute.adapter';
import { makeAddSurveyController } from '../factories';

export default (router: Router): void => {
  router.post('/surveys', adaptRoute(makeAddSurveyController()));
};
