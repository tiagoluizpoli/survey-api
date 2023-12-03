import { MongoHelper } from '@/infrastructure';

import { AddAccountRepository, LoadAccountByEmailRepository, Hasher } from '@/data';

import { DbAddAccount } from './db-add-account';
import { mockAccountData } from '@/domain/test';
import {
  mockAddAccountRepository,
  mockHasher,
  mockNullLoadAccountByEmailRepository,
} from '@/data/test';

interface MakeSutResult {
  sut: DbAddAccount;
  hasherStub: Hasher;
  addAccountRepositoryStub: AddAccountRepository;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
}

const makeSut = (): MakeSutResult => {
  const hasherStub = mockHasher();

  const addAccountRepositoryStub = mockAddAccountRepository();

  const loadAccountByEmailRepositoryStub = mockNullLoadAccountByEmailRepository();

  const sut = new DbAddAccount(
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub,
  );

  return { sut, hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub };
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let accountCollection: any;
describe('DbAddAccount Usecase', () => {
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

  it('should call hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut();
    const hashSpy = jest.spyOn(hasherStub, 'hash');

    const { addAccountMock } = mockAccountData();
    const { password } = addAccountMock;
    await sut.add(addAccountMock);

    expect(hashSpy).toHaveBeenCalledWith(password);
  });

  it('should throw if hasher throws', async () => {
    const { sut, hasherStub } = makeSut();
    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(Promise.reject(new Error()));
    const { addAccountMock } = mockAccountData();

    const promise = sut.add(addAccountMock);

    await expect(promise).rejects.toThrow();
  });

  it('should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');

    const { addAccountMock } = mockAccountData();

    await sut.add(addAccountMock);

    expect(addSpy).toHaveBeenCalledWith({ ...addAccountMock, password: 'hashed_password' });
  });

  it('should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(Promise.reject(new Error()));
    const { addAccountMock } = mockAccountData();

    const promise = sut.add(addAccountMock);

    await expect(promise).rejects.toThrow();
  });

  it('should return an account on success', async () => {
    const { sut } = makeSut();

    const { addAccountMock, accountMock } = mockAccountData();

    const account = await sut.add(addAccountMock);

    expect(account).toEqual(accountMock);
  });

  it('should return null if loadAccountByEmailRepository returns an account', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    const { addAccountMock, accountMock } = mockAccountData();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(Promise.resolve(accountMock));

    const account = await sut.add(addAccountMock);

    expect(account).toBeNull();
  });

  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    const loadByEmailSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail');

    const { addAccountMock } = mockAccountData();

    await sut.add(addAccountMock);

    expect(loadByEmailSpy).toHaveBeenCalledWith(addAccountMock.email);
  });
});
