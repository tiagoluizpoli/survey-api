import { Router } from 'express';
import { makeSignUpController } from '../factories';
import { adaptRoute } from '../adapters/express/expressRoute.adapter';

export default (router: Router): void => {
  const controller = makeSignUpController();
  router.post('/signup', adaptRoute(controller));
};
