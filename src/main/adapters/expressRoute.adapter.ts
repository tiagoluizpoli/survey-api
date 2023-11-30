import { Request, Response } from 'express';
import { Controller, HttpRequest } from '@/presentation';

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body,
      params: req.params,
      accountId: req.accountId,
    };

    const httpResponse = await controller.handle(httpRequest);
    if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
      res.status(httpResponse.statusCode).json(httpResponse.body);
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
