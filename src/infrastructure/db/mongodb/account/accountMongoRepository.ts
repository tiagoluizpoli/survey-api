import { ObjectId, WithId } from 'mongodb';
import {
  AddAccountRepository,
  LoadAccountByEmailRepository,
  LoadAccountByTokenRepository,
  UpdateAccessTokenRepository,
} from '@/data';
import { AddAccountParams, AccountModel } from '@/domain';
import { MongoHelper } from '../helpers';

export class AccountMongoRepository
  implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository,
    LoadAccountByTokenRepository
{
  constructor() {}

  add = async (accountData: AddAccountParams): Promise<AccountModel> => {
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

  loadByToken = async (token: string, role?: string): Promise<AccountModel | null> => {
    role;
    const accountCollection = await MongoHelper.getCollection('accounts');
    const account = await accountCollection.findOne<WithId<AccountModel>>({
      accessToken: token,
      $or: [
        {
          role,
        },
        {
          role: 'admin',
        },
      ],
    });

    if (account === null) {
      return null;
    }
    return MongoHelper.map(account);
  };

  updateAccessToken = async (id: string, token: string): Promise<void> => {
    const accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          accessToken: token,
        },
      },
    );
  };
}
