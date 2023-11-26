import { adaptMiddleware } from '../adapters';
import { makeAuthMiddleware } from '../factories';

export const auth = adaptMiddleware(makeAuthMiddleware());
