import { firestore } from '../config/firebase.config';
import { collection, deleteDoc, doc, DocumentData, DocumentReference, DocumentSnapshot, getDoc, QuerySnapshot, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { IUser } from '../interfaces/user';

interface IFirestoreUser {
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  createdAt: Timestamp,
  apartment: DocumentReference | undefined
}

export class UserService {

  static async create(user: Partial<IUser>): Promise<IUser> {
    const userCol = collection(firestore, 'users');
    const newUserDoc = doc(userCol, user.id);

    let userData = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: Timestamp.now(),
    } as IFirestoreUser

    try {
      await setDoc(newUserDoc, userData);
      return userData;
    } catch (e) {
      const msg = 'Error by creating user in Firestore: ' + e;
      console.error(msg);
      throw new Error(msg);
    }
  }

  static async getUser(id: string): Promise<IUser | undefined> {
    const docRef = doc(firestore, 'users', id);
    const docSnap = await getDoc(docRef);

    try {
      return await UserService.getDataFromDocument(docSnap);
    } catch (e) {
      console.error('No such document! ', e);
      return undefined;
    }
  }

  static async updateUser(id: string, user: Partial<IUser>): Promise<IUser | undefined> {
    const docRef = doc(firestore, 'users', id);
    let { apartmentId, ...userData } = user;
    if (apartmentId) {
      const apartmentCol = collection(firestore, 'apartments');
      const apartmentDoc = doc(apartmentCol, user.apartmentId);
      (userData as Partial<IFirestoreUser>).apartment = apartmentDoc;
    }

    try {
      await updateDoc(docRef, userData);
      return await UserService.getUser(id);
    } catch (e) {
      const msg = 'Error by updating user in Firestore: ' + e;
      console.error(msg);
      throw new Error(msg);
    }
  }

  static async deleteUser(userId: IUser['id']): Promise<void> {
    const userRef = doc(firestore, 'users' + userId);
    try {
      await deleteDoc(userRef);
    } catch(e) {
      const msg = 'Error by deleting user in Firestore: ' + e;
      console.error(msg);
      throw new Error(msg);
    }
  }

 static getDataFromQuerySnapshot(snapshot: QuerySnapshot<DocumentData>): Promise<IUser>[] {
    return snapshot.docs.map(async value => {
      return await UserService.getDataFromDocument(value);
    });
  }

  static async getDataFromDocument(doc: DocumentSnapshot<DocumentData>): Promise<IUser> {
    const data = doc.data();
    if (data) {
      const user = { ...data, createdAt: data.createdAt.toDate(), id: doc.id };
      if (data.apartment) {
        const apartmentId = data.apartment.id;
        return { ...user, apartmentId } as IUser;
      } else {
        return user as IUser;
      }
    } else {
      throw new Error('DocumentSnapshot contains no data!')
    }
  }
}