import { WithId } from 'mongodb';
import { AddAccountRepository } from '../../../data';
import { AddAccountModel, AccountModel } from '../../../domain';
import { MongoHelper } from './helpers/mongo.helper';

export class AccountMongoRepository implements AddAccountRepository {
  constructor() {}
  add = async (accountData: AddAccountModel): Promise<AccountModel> => {
    const accountCollection = MongoHelper.getCollection('accounts');
    const result = await accountCollection.insertOne(accountData);
    const account = await accountCollection.findOne<WithId<AccountModel>>({
      _id: result.insertedId,
    });

    const { _id, ...newAccount } = account as WithId<AccountModel>;
    return Object.assign({}, newAccount, { id: _id as unknown as string });
  };
}
