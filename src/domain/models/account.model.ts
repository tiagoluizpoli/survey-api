import { AuditableEntity } from './auditable-entity.model';

export interface AccountModel extends AuditableEntity {
  name: string;
  email: string;
  password: string;
  accessToken?: string;
}
