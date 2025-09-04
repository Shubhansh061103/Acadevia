// types/user.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role?: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUEST = 'GUEST'
}

export interface UserProfile extends User {
  avatar?: string;
  bio?: string;
  phone?: string;
}

export type UserCredentials = {
  email: string;
  password: string;
};