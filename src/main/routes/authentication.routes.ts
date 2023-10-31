import { Router } from 'express';
import { makeLoginController, makeSignUpController } from '../factories';
import { adaptRoute } from '../adapters/express/expressRoute.adapter';

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()));
  router.post('/login', adaptRoute(makeLoginController()));
};
