import { Encrypter } from '../../data';
import bcrypt from 'bcrypt';
export class BcryptAdapter implements Encrypter {
  constructor(private readonly salt: number) {}
  encrypt = async (value: string): Promise<string> => {
    const hashedPassword = await bcrypt.hash(value, this.salt);
    return hashedPassword;
  };
}
