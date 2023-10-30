import { WithId } from 'mongodb';
import { AddAccountRepository, LoadAccountByEmailRepository } from '../../../../data';
import { AddAccountModel, AccountModel } from '../../../../domain';
import { MongoHelper } from '../helpers';

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository {
  constructor() {}

  add = async (accountData: AddAccountModel): Promise<AccountModel> => {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const result = await accountCollection.insertOne(accountData);
    const account = await accountCollection.findOne<WithId<AccountModel>>({
      _id: result.insertedId,
    });

    return MongoHelper.map<AccountModel>(account);
  };
  loadByEmail = async (email: string): Promise<AccountModel | null> => {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const account = await accountCollection.findOne<WithId<AccountModel>>({ email });

    if (account === null) {
      return null;
    }
    return MongoHelper.map(account);
  };
}
