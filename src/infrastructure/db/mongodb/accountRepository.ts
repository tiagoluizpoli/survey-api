import { WithId } from 'mongodb';
import { AddAccountRepository } from '../../../data';
import { AddAccountModel, AccountModel } from '../../../domain';
import { MongoHelper, map } from './helpers';

export class AccountMongoRepository implements AddAccountRepository {
  constructor() {}
  add = async (accountData: AddAccountModel): Promise<AccountModel> => {
    const accountCollection = MongoHelper.getCollection('accounts');
    const result = await accountCollection.insertOne(accountData);
    const account = await accountCollection.findOne<WithId<AccountModel>>({
      _id: result.insertedId,
    });

    return map(account);
  };
}
