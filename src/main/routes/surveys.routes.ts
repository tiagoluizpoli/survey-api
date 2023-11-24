import { Router } from 'express';
import { adaptRoute } from '../adapters/expressRoute.adapter';
import { makeAddSurveyController, makeAuthMiddleware } from '../factories';
import { adaptMiddleware } from '../adapters';

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'));
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()));
};
