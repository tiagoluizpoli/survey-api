import { Collection } from 'mongodb';
import { AccountModel, AddAccountModel } from '@/domain';
import { MongoHelper } from '../helpers/mongo.helper';
import { AccountMongoRepository } from './accountMongoRepository';

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

  describe('add()', () => {
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
  });
  describe('loadByEmmail()', () => {
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

      expect(account).toBeFalsy();
    });
  });

  describe('updateAccessToken()', () => {
    it('should update the account accessToken on updateAccessTokenSuccess', async () => {
      const { sut } = makeSut();
      const { addAccount } = makeFakeData();

      // insert one account to be updated afterwards.
      const res = await accountCollection.insertOne({ ...addAccount, id: 'any_id' });

      // fetch the account updated and test if accessToken is undefined (falsy)
      const accountBeforeUpdate = await accountCollection.findOne<AccountModel>({
        _id: res.insertedId,
      });
      expect(accountBeforeUpdate?.accessToken).toBeFalsy();

      // update account accessToken and test if accesstoken was successfuly updated
      await sut.updateAccessToken(res.insertedId.toString(), 'any_token');
      const account = await accountCollection.findOne<AccountModel>({
        _id: res.insertedId,
      });

      expect(account).toBeTruthy();
      expect(account?.accessToken).toBe('any_token');
    });
  });

  describe('loadByToken()', () => {
    it('should return an account on loadByToken without role', async () => {
      const { sut } = makeSut();
      const { addAccount } = makeFakeData();
      await accountCollection.insertOne({ ...addAccount, id: 'any_id', accessToken: 'any_token' });

      const account = await sut.loadByToken('any_token');

      expect(account).toBeTruthy();
      expect(account?.id).toBeTruthy();
      expect(account?.name).toBe('any_name');
      expect(account?.email).toBe('any@email.com');
      expect(account?.password).toBe('any_password');
    });

    it('should return an account on loadByToken with admin role', async () => {
      const { sut } = makeSut();
      const { addAccount } = makeFakeData();
      await accountCollection.insertOne({
        ...addAccount,
        id: 'any_id',
        accessToken: 'any_token',
        role: 'admin',
      });

      const account = await sut.loadByToken('any_token', 'admin');

      expect(account).toBeTruthy();
      expect(account?.id).toBeTruthy();
      expect(account?.name).toBe('any_name');
      expect(account?.email).toBe('any@email.com');
      expect(account?.password).toBe('any_password');
    });

    it('should return null on loadByToken with invalid role', async () => {
      const { sut } = makeSut();
      const { addAccount } = makeFakeData();
      await accountCollection.insertOne({
        ...addAccount,
        id: 'any_id',
        accessToken: 'any_token',
      });

      const account = await sut.loadByToken('any_token', 'admin');

      expect(account).toBeFalsy();
    });

    it('should return an account on loadByToken if user is admin', async () => {
      const { sut } = makeSut();
      const { addAccount } = makeFakeData();
      await accountCollection.insertOne({
        ...addAccount,
        id: 'any_id',
        accessToken: 'any_token',
        role: 'admin',
      });

      const account = await sut.loadByToken('any_token');

      expect(account).toBeTruthy();
      expect(account?.id).toBeTruthy();
      expect(account?.name).toBe('any_name');
      expect(account?.email).toBe('any@email.com');
      expect(account?.password).toBe('any_password');
    });

    it('should return null if loadByToken fails', async () => {
      const { sut } = makeSut();

      const account = await sut.loadByToken('any_token');

      expect(account).toBeFalsy();
    });
  });
});
