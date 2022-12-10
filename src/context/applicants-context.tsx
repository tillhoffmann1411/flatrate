import React, { createContext, FC, useState } from 'react';
import IApplicant from '../interfaces/applicant';


// Define Context Type
interface IApplicantsContext {
  applicants: IApplicant[],
  editMode: boolean,
  setEditMode: (active: boolean) => void,
  setApplicants: (applicants: IApplicant[]) => void,
  updateApplicant: (applicant: IApplicant) => void,
  addApplicant: (applicant: IApplicant) => void,
  deleteApplicant: (id: string) => void
}

// Provider
const ApplicantsContext = createContext<IApplicantsContext>({} as IApplicantsContext);

export const ApplicantsProvider: FC = ({ children }) => {
  const [applicants, setApplicants] = useState<IApplicant[]>([]);
  const [editMode, setEditMode] = useState(false);

  const updateApplicant = (applicant: IApplicant) => {
    setApplicants((prev) => {
      return prev.map((a) => a.id === applicant.id ? applicant : a);
    });
  };
  const addApplicant = (applicant: IApplicant) => {
    setApplicants((prev) => [...prev, applicant]);
  };
  const deleteApplicant = (id: string) => {
    setApplicants((prev) => [...prev.filter((a) => a.id !== id)]);
  }

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <ApplicantsContext.Provider value={{ applicants, editMode, setEditMode, setApplicants, updateApplicant, addApplicant, deleteApplicant }}>
      {children}
    </ApplicantsContext.Provider>
  );
};

// Export to app
export default ApplicantsContext;
