import { ref, update, get } from '@firebase/database';
import { collection, doc, getDoc, updateDoc } from '@firebase/firestore';
import { getDocs } from 'firebase/firestore';
import {  db, firestore } from '../config/firebase.config';
import { IApartment } from '../interfaces/apartment';
import IApplicant from '../interfaces/applicant';


export class ApplicantService {
  static async getApplicants(apartmentId: string) : Promise<IApplicant[]> {
    const querySnapshot = await getDocs(collection(firestore, 'applicants-' + apartmentId));
    const applicants: IApplicant[] = [];
    querySnapshot.forEach((applicant) => {
      applicants.push(applicant.data() as IApplicant);
    });
    return applicants;
  }
  
  static async getApplicant(apartmentId: string, id: string): Promise<IApplicant | undefined> {
    const querySnapshot = doc(firestore, 'applicants-' + apartmentId, id);
    const applicant = (await getDoc(querySnapshot)).data();
    return applicant as IApplicant;
  }

  static async updateFirestoreApplicant(applicant: IApplicant): Promise<void> {
    const applRef = doc(firestore, 'applicants-' + applicant.apartment?.id, applicant.id);
    delete applicant.apartment
    await updateDoc(applRef, {...applicant});
  }

  
}
