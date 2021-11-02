import { IApartment } from './apartment';

export interface IUser {
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  apartment: IApartment | undefined,
  createdAt: Date
}

export interface IAuthUser {
  id: string,
  name: string,
  email: string
}