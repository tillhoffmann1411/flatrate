import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, User } from '@firebase/auth';
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { auth } from '../config/firebase.config';
import { IAuthUser } from '../interfaces/user';

export class AuthService {
  
  static onAuthStateChanged(cb: (user?: IAuthUser) => void): void {
    auth.onAuthStateChanged((fireUser: User | null) => {
      if (fireUser && fireUser.displayName && fireUser.email) {
        const user: IAuthUser = {
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
  
  static async signIn(email: string, password: string): Promise<IAuthUser | undefined> {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    if (userCred.user.email && userCred.user.uid && userCred.user.displayName) {

      return { email: userCred.user.email, id: userCred.user.uid, name: userCred.user.displayName };
    } else {
      throw new Error('Some error by signing in occoured');
    }
  }
  
  static async signUp(firstname: string, lastname: string, email: string, password: string): Promise<IAuthUser | undefined> {
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

  static async deleteUser(): Promise<void> {
    const user = auth.currentUser;
    if (user) {
      try {
        await deleteUser(user);
        AuthService.signOut();
      } catch(e) {
        throw new Error('Error by deleting Auth-User: ' + e);
      }
    }
  }

  static async updatePasswort(newPassword: string, oldPassword: string): Promise<boolean> {
    const user = auth.currentUser;
    if (user && user.email) {
      try {
        await signInWithEmailAndPassword(auth, user.email, oldPassword);
        const newUserCred = await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, oldPassword));
        try {
          await updatePassword(newUserCred.user, newPassword);
          return true
        } catch(e) {
          throw new Error('Error by changing user password: ' + e);
        }
      } catch(e) {
        throw new Error('Error by changing user password. Wrong old password. ' + e);
      }
    }
    return false;
  }

}