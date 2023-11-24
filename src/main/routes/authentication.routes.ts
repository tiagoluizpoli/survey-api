import { Router } from 'express';
import { makeLoginController, makeSignUpController } from '../factories';
import { adaptRoute } from '../adapters/expressRoute.adapter';

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()));
  router.post('/signin', adaptRoute(makeLoginController()));
};
