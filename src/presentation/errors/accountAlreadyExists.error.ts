export class AccountAlreadyExistsError extends Error {
  constructor() {
    super(`The account already exists`);
    this.name = 'AccountAlreadyExistsError';
  }
}
