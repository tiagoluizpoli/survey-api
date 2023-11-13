import { LogMongoRepository } from '../../../infrastructure';
import { Controller } from '../../../presentation';
import { LogControllerDecorator } from '../../decorators';

export const makeLogControllerDecorator = (controller: Controller): Controller => {
  const logMongoRepository = new LogMongoRepository();

  return new LogControllerDecorator(controller, logMongoRepository);
};
