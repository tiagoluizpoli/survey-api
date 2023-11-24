import { Decrypter, Encrypter } from '../../../data';
import jwt from 'jsonwebtoken';
export class JwtAdapter implements Encrypter, Decrypter {
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

  decrypt = async (value: string): Promise<string | null> => {
    value;
    await jwt.verify(value, this.secret);
    return null;
  };
}
