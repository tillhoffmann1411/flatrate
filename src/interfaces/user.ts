import { Timestamp } from 'firebase/firestore';

export interface IUser {
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  createdAt: Timestamp,
  apartmentId?: string,
}

export interface IAuthUser {
  id: string,
  name: string,
  email: string
}