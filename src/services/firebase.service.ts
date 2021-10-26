import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, User } from '@firebase/auth';
import { ref, update, get } from '@firebase/database';
import { auth, db } from '../config/firebase.config';
import IApplicant from '../interfaces/applicant';
import { IUser } from '../interfaces/user';


export class FirebaseService {
  static async updateApplicant(applicant: IApplicant) {
    const dbRef = ref(db, 'applicants/' + applicant.id);
    await update(dbRef, applicant);
  }

  static async getApplicant(id: string): Promise<IApplicant> {
    const dbRef = ref(db, 'applicants/' + id);
    const snapshot = await get(dbRef);
    return snapshot.val() as IApplicant;
  }

  static async getApplicants() : Promise<IApplicant[]> {
    const dbRef = ref(db, 'applicants');
      const snapshot = await get(dbRef);
      const applicants: IApplicant[] = [];
      snapshot.forEach((applicantSnap: any) => {
        applicants.push(applicantSnap.val())
      });
      return applicants;
  }

  static onAuthStateChanged(cb: (user?: IUser) => void): void {
    auth.onAuthStateChanged((fireUser: User | null) => {
      if (fireUser && fireUser.displayName && fireUser.email) {
        const user: IUser = {
          id: fireUser.uid,
          name: fireUser.displayName,
          email: fireUser.email
        };
        cb(user);
      } else {
        cb(undefined);
      }
    });
  }

  static async signIn(email: string, password: string): Promise<IUser | undefined> {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    if (userCred.user.email && userCred.user.uid && userCred.user.displayName) {
      return { email: userCred.user.email, id: userCred.user.uid, name: userCred.user.displayName };
    } else {
      throw new Error('Some error by signing in occoured');
    }
  }

  static async signUp(firstname: string, lastname: string, email: string, password: string): Promise<IUser | undefined> {
    const name = firstname + ' ' + lastname;
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCred.user, { displayName: name });
    if (userCred.user.email && userCred.user.uid) {
      return { email: userCred.user.email, id: userCred.user.uid, name };
    } else {
      throw new Error('Some error by signing up occoured');
    }
  }

  static async signOut() {
    await signOut(auth);
  }
}
