import { Collection } from 'mongodb';
import { AddAccountModel } from '../../../../domain';
import { MongoHelper } from '../helpers/mongo.helper';
import { AccountMongoRepository } from './accountRepository';

interface MakeFakeDataResult {
  addAccount: AddAccountModel;
}
const makeFakeData = (): MakeFakeDataResult => {
  const addAccount = {
    name: 'any_name',
    email: 'any@email.com',
    password: 'any_password',
  };
  return { addAccount };
};

interface MakeSutResult {
  sut: AccountMongoRepository;
}
const makeSut = (): MakeSutResult => {
  const sut = new AccountMongoRepository();
  return { sut };
};

let accountCollection: Collection;
describe('AccountRepository (Mongodb)', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  it('should return an account on add success', async () => {
    const { sut } = makeSut();
    const { addAccount } = makeFakeData();

    const account = await sut.add(addAccount);

    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe('any_name');
    expect(account.email).toBe('any@email.com');
    expect(account.password).toBe('any_password');
  });

  it('should return an account on loadByEmail success', async () => {
    const { sut } = makeSut();
    const { addAccount } = makeFakeData();
    await accountCollection.insertOne({ ...addAccount, id: 'any_id' });

    const account = await sut.loadByEmail(addAccount.email);

    expect(account).toBeTruthy();
    expect(account?.id).toBeTruthy();
    expect(account?.name).toBe('any_name');
    expect(account?.email).toBe('any@email.com');
    expect(account?.password).toBe('any_password');
  });

  it('should return null if loadByEmail fails', async () => {
    const { sut } = makeSut();
    const { addAccount } = makeFakeData();

    const account = await sut.loadByEmail(addAccount.email);

    expect(account).toBe(null);
  });
});
