export class InvalidParamLenght extends Error {
  constructor(paramName: string) {
    super(`The array field '${paramName}' lenght is under the required`);
    this.name = 'InvalidParamLenght';
  }
}
