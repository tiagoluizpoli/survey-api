import { Request, Response } from 'express';
import { Controller, HttpRequest } from '../../presentation';

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body,
    };

    const httpResponse = await controller.handle(httpRequest);
    if (httpResponse.statusCode === 200) {
      res.status(httpResponse.statusCode).json(httpResponse.body);
      return;
    }
    res.status(httpResponse.statusCode).json({
      error: {
        code: httpResponse.body.name,
        message: httpResponse.body.message,
        timestamp: new Date().toLocaleString(),
      },
    });
  };
};
