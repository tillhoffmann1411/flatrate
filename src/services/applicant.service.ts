import { ref, update, get } from '@firebase/database';
import {  db } from '../config/firebase.config';
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

  static async getApplicants() : Promise<IApplicant[]> {
    const dbRef = ref(db, 'applicants');
      const snapshot = await get(dbRef);
      const applicants: IApplicant[] = [];
      snapshot.forEach((applicantSnap: any) => {
        applicants.push(applicantSnap.val())
      });
      return applicants;
  }

  
}
