import { AuditableEntity } from './auditableEntity';

export interface AccountModel extends AuditableEntity {
  name: string;
  email: string;
  password: string;
}
