import { Encrypter } from '../../data';
import { hash } from 'bcrypt';
export class BcryptAdapter implements Encrypter {
  constructor(private readonly salt: number) {}
  encrypt = async (value: string): Promise<string> => {
    const hashedPassword = await hash(value, this.salt);
    return hashedPassword;
  };
}
