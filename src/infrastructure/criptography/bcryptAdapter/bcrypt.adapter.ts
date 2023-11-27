import { HashComparer, Hasher } from '@/data';
import bcrypt from 'bcrypt';
export class BcryptAdapter implements Hasher, HashComparer {
  constructor(private readonly salt: number) {}
  hash = async (value: string): Promise<string> => {
    const hashedPassword = await bcrypt.hash(value, this.salt);
    return hashedPassword;
  };

  compare = async (value: string, hash: string): Promise<boolean> => {
    const isValid = await bcrypt.compare(value, hash);
    return isValid;
  };
}
