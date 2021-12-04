import { ref, update, get } from '@firebase/database';
import { collection, doc, DocumentReference, getDoc, updateDoc } from '@firebase/firestore';
import { getDocs } from 'firebase/firestore';
import {  db, firestore } from '../config/firebase.config';
import { IApartment } from '../interfaces/apartment';
import IApplicant from '../interfaces/applicant';


export class ApplicantService {
  static async updateApplicant(applicant: IApplicant) {
    const dbRef = ref(db, 'applicants/' + applicant.id);
    await update(dbRef, applicant);
  }

  static async getApplicant(id: string): Promise<IApplicant> {
    const dbRef = ref(db, 'applicants/' + id);
    const snapshot = await get(dbRef);
    return snapshot.val() as IApplicant;
  }

  static async getApplicants(apartmentId: string) : Promise<IApplicant[]> {
    const dbRef = ref(db, 'applicants');
      const snapshot = await get(dbRef);
      const applicants: IApplicant[] = [];
      snapshot.forEach((applicantSnap: any) => {
        applicants.push(applicantSnap.val())
      });
      return applicants;
  }

  static async getFirestoreApplicants(apartmentId: string): Promise<IApplicant[]> {
    let collectionName = 'applicants';
    if (apartmentId) {
      collectionName += '-' + apartmentId;
    }
    const querySnapshot = await getDocs(collection(firestore, collectionName));
    const apartmentRef = querySnapshot.docs[0].data().apartment as DocumentReference;
    const apartment = (await getDoc(apartmentRef)).data() as IApartment;
    return querySnapshot.docs.map((doc) => {
      if (apartment) {
        return { ...doc.data(), apartment } as IApplicant;
      } else {
        return doc.data() as IApplicant;
      }
    });
  }
  
  static async getFirestoreApplicant(apartmentId: string, id: string): Promise<IApplicant> {
    const querySnapshot = doc(firestore, 'applicants-' + apartmentId, id);
    const applicant = (await getDoc(querySnapshot)).data();
    const apartment = (await getDoc(applicant?.apartment)).data() as IApartment;
    if (apartment) {
      return { ...applicant, apartment } as IApplicant;
    } else {
      return applicant as IApplicant;
    }
  }

  static async updateFirestoreApplicant(applicant: IApplicant): Promise<void> {
    const applRef = doc(firestore, 'applicants-' + applicant.apartment?.id, applicant.id);
    delete applicant.apartment
    await updateDoc(applRef, {...applicant});
  }

  
}
