import { firestore } from '../config/firebase.config';
import { collection, deleteDoc, doc, DocumentData, DocumentReference, DocumentSnapshot, getDoc, getDocs, query, QuerySnapshot, setDoc, Timestamp, updateDoc, where } from 'firebase/firestore';
import { IUser } from '../interfaces/user';
import { IApartment } from '../interfaces/apartment';

interface IFirestoreUser {
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  createdAt: Timestamp,
  apartment: DocumentReference | undefined
}

interface IFirebaseApartment {
  id: string,
  name: string,
  flatmates: DocumentReference[]
}


export class UserService {

  static async create(user: IUser): Promise<IUser> {
    const userCol = collection(firestore, 'users');
    const newUserDoc = doc(userCol, user.id);

    let userData = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: Timestamp.fromDate(user.createdAt),
      apartment: undefined
    } as IFirestoreUser
    
    if (user.apartment) {
      const apartmentCol = collection(firestore, 'apartments');
      const apartmentDoc = doc(apartmentCol, user.apartment.id);
      userData = {
        ...userData,
        apartment: apartmentDoc
      }
    }

    try {
      await setDoc(newUserDoc, userData);
      return user;
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

  static async getAllUserFromApartment(apartmentId: string): Promise<IUser[] | undefined> {
    const apartmentCol = collection(firestore, 'apartments');
    const apartmentDoc = doc(apartmentCol, apartmentId);

    const usersRef = collection(firestore, 'users');
    const flatmatesQuery = query(usersRef, where('apartment', '==', apartmentDoc));

    const querySnapshot = await getDocs(flatmatesQuery);
    const users = await Promise.all(UserService.getDataFromQuerySnapshot(querySnapshot));

    if (users.length > 0) {
      return users as IUser[];
    } else {
      // doc.data() will be undefined in this case
      console.error('No users found!');
      return undefined;
    }
  }

  static async updateUser(user: IUser): Promise<IUser> {
    const docRef = doc(firestore, 'users', user.id);
    
    let userData = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: Timestamp.fromDate(user.createdAt),
      apartment: undefined
    } as Partial<IFirestoreUser>;

    console.log(user);
    if (user.apartment) {
      const apartmentCol = collection(firestore, 'apartments');
      const apartmentDoc = doc(apartmentCol, user.apartment.id);
      userData = {
        ...userData,
        apartment: apartmentDoc
      }
    }

    try {
      await setDoc(docRef, userData);
      await updateDoc(docRef, userData);
      return user;
    } catch (e) {
      const msg = 'Error by creating user in Firestore: ' + e;
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

  static async createApartment(name: string, flatmateIds: string[]): Promise<IApartment> {
    const apartmentCol = collection(firestore, 'apartments');
    const apartmentDoc = doc(apartmentCol);

    const flatmateRefs: DocumentReference[] = flatmateIds.map(id => doc(collection(firestore, 'users'), id))
    const flatmates = (await Promise.all(flatmateIds.map(async id => await UserService.getUser(id)))).filter(f => f) as IUser[];

    const firebaseApartment: IFirebaseApartment = {
      id: apartmentDoc.id,
      flatmates: flatmateRefs,
      name,
    };
    const apartment: IApartment = {
      id: apartmentDoc.id,
      flatmates,
      name
    }
    try {
      await setDoc(apartmentDoc, firebaseApartment);
      return apartment;
    } catch (e) {
      const msg = 'Error by creating apartmentDoc in Firestore: ' + e;
      console.error(msg);
      throw new Error(msg);
    }
  }

  private static getDataFromQuerySnapshot(snapshot: QuerySnapshot<DocumentData>): Promise<IUser>[] {
    return snapshot.docs.map(async value => {
      return await UserService.getDataFromDocument(value);
    });
  }

  private static async getDataFromDocument(doc: DocumentSnapshot<DocumentData>): Promise<IUser> {
    if (doc.data()) {
      if (!doc.data()?.createdAt) {
        throw new Error('CreatedAt from user does not exist!')
      }
      const user = { ...doc.data(), createdAt: doc.data()!.createdAt.toDate(), apartment: doc.data()?.apartment, id: doc.id };
      if (user.apartment) {
        const apartmentSnap = await getDoc(user.apartment);
        const apartment = apartmentSnap.data();
        return { ...user, apartment } as IUser;
      } else {
        return user as IUser;
      }
    } else {
      throw new Error('DocumentSnapshot contains no data!')
    }
  }
}