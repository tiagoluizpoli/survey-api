import { Router } from 'express';
import { adaptRoute } from '../adapters/expressRoute.adapter';
import {
  makeAddSurveyController,
  makeAuthMiddleware,
  makeLoadSurveysController,
} from '../factories';
import { adaptMiddleware } from '../adapters';

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'));
  const auth = adaptMiddleware(makeAuthMiddleware());
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()));
  router.get('/surveys', auth, adaptRoute(makeLoadSurveysController()));
};
