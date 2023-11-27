import { LogErrorRepository } from '@/data';
import { MongoHelper } from '../helpers';

export class LogMongoRepository implements LogErrorRepository {
  constructor() {}
  logError = async (stack: string): Promise<void> => {
    const errorCollection = await MongoHelper.getCollection('errors');
    errorCollection.insertOne({
      stack,
      date: new Date(),
    });
  };
}
