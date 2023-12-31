import { NextFunction, Request, Response } from 'express';
import { HttpRequest, Middleware } from '@/presentation';

export const adaptMiddleware = (middleware: Middleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const httpRequest: HttpRequest = {
      headers: req.headers,
    };

    const httpResponse = await middleware.handle(httpRequest);
    if (httpResponse.statusCode === 200) {
      Object.assign(req, httpResponse.body);
      next();
      return;
    }

    res.status(httpResponse.statusCode).json({
      error: {
        message: httpResponse.body.message,
        timestamp: new Date().toLocaleString(),
      },
    });
  };
};
