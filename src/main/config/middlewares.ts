import { bodyParser } from '../middlewared/bodyParser';
import { Express } from 'express';

export default (app: Express): void => {
  app.use(bodyParser);
};
