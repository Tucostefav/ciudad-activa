import type { UserRole } from './enums';

export interface User {
  uid: string;
  full_name: string;
  email: string;
  role: UserRole;
  created_at?: number;
}

// Lo que se guarda en el teléfono para recordar al usuario
export type SessionData = Pick<User, 'uid' | 'full_name' | 'email' | 'role'>;
