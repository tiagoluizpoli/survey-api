import { Router } from 'express';
import { adaptRoute } from '../adapters/expressRoute.adapter';

import { auth } from '../middlewares';
import { makeSaveSurveyResultController } from '@/main/factories';

export default (router: Router): void => {
  router.put('/surveys/:surveyId/results', auth, adaptRoute(makeSaveSurveyResultController()));
};
