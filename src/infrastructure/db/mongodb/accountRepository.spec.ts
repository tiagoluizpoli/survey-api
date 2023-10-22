import { MongoHelper as sut } from './helpers/mongo.helper';

describe('AccountRepository (Mongodb)', () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await sut.disconnect();
  });

  beforeEach(async () => {
    const accountCollection = await sut.getCollection('account');
    await accountCollection.deleteMany({});
  });

  it('should return an account on success', async () => {
    let accountCollection = sut.getCollection('accounts');
    expect(accountCollection).toBeTruthy();
    await sut.disconnect();
    accountCollection = sut.getCollection('accounts');
    expect(accountCollection).toBeTruthy();
  });
});
