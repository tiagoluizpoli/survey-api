import { Collection } from 'mongodb';
import { MongoHelper } from '../helpers';
import { LogMongoRepository } from './logMongoRepository';
import { LogErrorRepository } from '../../../../data';

const makeSut = (): LogErrorRepository => {
  return new LogMongoRepository();
};

describe('Log Mongo Repository', () => {
  let errorCollection: Collection;
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors');
    await errorCollection.deleteMany({});
  });
  it('should create an error log on success', async () => {
    const sut = makeSut();
    await sut.logError('any error stack');
    const count = await errorCollection.countDocuments();
    expect(count).toBe(1);
  });
});
