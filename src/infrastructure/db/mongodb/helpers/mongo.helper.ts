import { Collection, MongoClient, WithId } from 'mongodb';

interface IMongoHelper {
  uri: string;
  client: null | MongoClient;
  connect: (uri: string) => Promise<void>;
  disconnect: () => Promise<void>;
  getCollection: (name: string) => Promise<Collection>;
  map: <T>(collection: WithId<T> | null) => Omit<WithId<T>, '_id'> & {
    id: string;
  };
}

export const MongoHelper: IMongoHelper = {
  uri: '',
  client: null,
  async connect(uri: string): Promise<void> {
    this.uri = uri;
    this.client = await MongoClient.connect(uri);
  },
  async disconnect() {
    if (this.client) {
      await this.client.close();
    }
  },

  async getCollection(name: string): Promise<Collection> {
    return this.client!.db().collection(name);
  },
  map<T>(collection: WithId<T> | null) {
    const { _id, ...newAccount } = collection as WithId<T>;

    const refatoredAccount = { ...newAccount, id: _id.toString() };
    return refatoredAccount;
  },
};
