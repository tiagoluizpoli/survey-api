export class InvalidParamLenght extends Error {
  constructor(paramName: string) {
    super(`The ${paramName}'s lenght is under the required`);
    this.name = 'InvalidParamLenght';
  }
}
