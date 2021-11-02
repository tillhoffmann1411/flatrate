import { IUser } from './user';

export interface IApartment {
  id: string,
  name: string,
  flatmates: IUser[]
}