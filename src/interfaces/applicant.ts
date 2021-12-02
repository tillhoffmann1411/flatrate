import { IApartment } from './apartment';

export default interface IApplicant {
    name: string,
    text: string,
    gender?: 'male' | 'female',
    when: number,
    imageUrl: string,
    wggId: string | undefined,
    apartment?: IApartment,
    id: string,
    note: string,
    ratings: {[x: string]: number}[]
    status?: 'rejected' | 'open' | 'invited' | 'accepted',
}