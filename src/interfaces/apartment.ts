import { Timestamp } from 'firebase/firestore';
import { IUser } from './user';

export interface IApartment {
  id: string,
  name: string,
  flatmates: IUser[],
  identifier: string,
  createdAt: Timestamp,
}