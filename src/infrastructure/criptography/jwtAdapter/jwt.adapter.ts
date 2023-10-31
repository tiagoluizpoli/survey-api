import { Encrypter } from '../../../data';
import jwt from 'jsonwebtoken';
export class JwtAdapter implements Encrypter {
  constructor(private readonly secret: string) {}
  encrypt = async (value: string): Promise<string> => {
    value;
    const accessToken = await jwt.sign(
      {
        id: value,
      },
      this.secret,
    );
    return accessToken;
  };
}