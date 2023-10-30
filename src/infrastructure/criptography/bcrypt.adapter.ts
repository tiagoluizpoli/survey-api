import { Hasher } from '../../data';
import bcrypt from 'bcrypt';
export class BcryptAdapter implements Hasher {
  constructor(private readonly salt: number) {}
  hash = async (value: string): Promise<string> => {
    const hashedPassword = await bcrypt.hash(value, this.salt);
    return hashedPassword;
  };
}
