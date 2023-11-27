import { AuthMiddleware, Middleware } from '@/presentation';
import { makeDbLoadAccountByToken } from '../usecases';

export const makeAuthMiddleware = (role?: string): Middleware => {
  return new AuthMiddleware(makeDbLoadAccountByToken(), role);
};
