import { IUser } from './user';

export interface IFlat {
  id: string,
  name: string,
  flatmates: IUser[]
}