import { firestore } from '../config/firebase.config';
import { collection, deleteField, doc, DocumentData, DocumentReference, DocumentSnapshot, getDoc, getDocs, limit, query, QuerySnapshot, setDoc, Timestamp, updateDoc, where } from 'firebase/firestore';
import { IUser } from '../interfaces/user';
import { IApartment } from '../interfaces/apartment';
import { UserService } from './user.service';
import { customAlphabet } from 'nanoid'
import { ref, refFromURL } from 'firebase/database';
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 5);

interface IFirebaseApartment {
  id: string,
  name: string,
  identifier: string,
  createdAt: Timestamp,
  flatmates: DocumentReference[]
}


export class ApartmentService {

  static async create(name: string, user: IUser): Promise<IApartment> {
    const apartmentCol = collection(firestore, 'apartments');
    const apartmentDoc = doc(apartmentCol);

    // Add userRef to apartment
    const userRef = doc(firestore, 'users', user.id);

    const firebaseApartment: IFirebaseApartment = {
      id: apartmentDoc.id,
      flatmates: [userRef],
      identifier: nanoid(),
      createdAt: Timestamp.now(),
      name,
    };
    const apartment: IApartment = {
      id: apartmentDoc.id,
      identifier: firebaseApartment.identifier,
      createdAt: firebaseApartment.createdAt,
      flatmates: [user],
      name
    }

    const apartApplicCol = collection(firestore, 'applicatns-' + apartmentDoc.id);
    const apartApplicDoc = doc(apartApplicCol);
    setDoc(apartApplicDoc, {});

    const newUser = {
      ...user,
      apartmentId: apartment.id
    };
    await UserService.updateUser(newUser.id, newUser);
    try {
      await setDoc(apartmentDoc, firebaseApartment);
      return apartment;
    } catch (e) {
      const msg = 'Error by creating apartmentDoc in Firestore: ' + e;
      console.error(msg);
      throw new Error(msg);
    }
  }

  static async get(apartmentId: string): Promise<IApartment | undefined> {
    const apartmentCol = collection(firestore, 'apartments');
    const apartmentDoc = doc(apartmentCol, apartmentId);

    const apartment = (await getDoc(apartmentDoc)).data();

    const usersRef = collection(firestore, 'users');
    const flatmatesQuery = query(usersRef, where('apartment', '==', apartmentDoc));
    const querySnapshot = await getDocs(flatmatesQuery);
    const users = await Promise.all(UserService.getDataFromQuerySnapshot(querySnapshot));

    if (users.length > 0) {
      return { ...apartment, flatmates: users } as IApartment;
    } else {
      // doc.data() will be undefined in this case
      console.error('No users found!');
      return undefined;
    }
  }
  // qld7w
  static async join(apartmentIdentifier: string, user: IUser): Promise<IApartment | undefined> {
    // Find Apartment
    const apartmentSnap = await getDocs(query(
      collection(firestore, 'apartments'),
      where('identifier', '==', apartmentIdentifier),
      limit(1)
    ));
    // Get Apartment
    const apartments: DocumentData[] = [];
    apartmentSnap.forEach((doc) => apartments.push(doc));
    const foundApartment = apartments[0];

    // Add userRef to apartment
    const userRef = doc(firestore, 'users', user.id);
    await updateDoc(foundApartment.ref, { flatmates: [ ...foundApartment.data().flatmates, userRef] });

    // Add apartmentRef to user
    const newUser = {
      ...user,
      apartment: foundApartment.ref
    };
    await UserService.updateUser(newUser.id, newUser);

    return await ApartmentService.get(foundApartment.id);
  }

  static async leave(apartmentIdentifier: string, userId: string): Promise<IUser | undefined> {
    const apartmentSnap = await getDocs(query(
      collection(firestore, 'apartments'),
      where('identifier', '==', apartmentIdentifier),
      limit(1)
    ));
    const apartments: DocumentData[] = [];
    apartmentSnap.forEach((doc) => apartments.push(doc));
    const foundApartment = apartments[0];

    try {
      const userRef: DocumentReference = doc(firestore, 'users', userId);
      const apartment = foundApartment.data();
      const filteredFlatmates = apartment.flatmates.filter((m: DocumentReference) => m.id !== userRef.id);
      await updateDoc(foundApartment.ref, { flatmates: filteredFlatmates });
      await updateDoc(userRef, { apartment: deleteField() });
    } catch (e) {
      console.error(e);
    }

    return await UserService.getUser(userId);
  }

  private static getDataFromQuerySnapshot(snapshot: QuerySnapshot<DocumentData>): Promise<IApartment>[] {
    return snapshot.docs.map(async value => {
      return await ApartmentService.getDataFromDocument(value);
    });
  }

  private static async getDataFromDocument(doc: DocumentSnapshot<DocumentData>): Promise<IApartment> {
    const data = doc.data();
    if (data) {
      return { ...data, createdAt: data.createdAt.toDate(), id: doc.id } as IApartment;
    } else {
      throw new Error('DocumentSnapshot contains no data!')
    }
  }
}