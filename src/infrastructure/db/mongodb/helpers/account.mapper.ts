import { WithId } from 'mongodb';
import { AccountModel } from '../../../../domain';

export const map = (account: WithId<AccountModel> | null): AccountModel => {
  const { _id, ...newAccount } = account as WithId<AccountModel>;
  return Object.assign({}, newAccount, { id: _id as unknown as string });
};
