import { Collection, MongoClient, WithId } from 'mongodb';

export const MongoHelper = {
  client: null as unknown as MongoClient,
  async connect(uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri);
  },
  async disconnect() {
    await this.client.close();
  },

  getCollection(name: string): Collection {
    return this.client.db().collection(name);
  },
  map<T>(collection: WithId<T> | null) {
    const { _id, ...newAccount } = collection as WithId<T>;

    const refatoredAccount = { ...newAccount, id: _id.toString() };
    return refatoredAccount;
  },
};
