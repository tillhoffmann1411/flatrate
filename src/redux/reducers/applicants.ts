import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IApplicant from '../../interfaces/applicant';

interface IApplicantsState {
  applicants: IApplicant[],
  selectedApplicant: IApplicant | undefined
}

const applicantsSlice = createSlice({
  name: 'applicants',
  initialState: {
    applicants: [],
    selectedApplicant: undefined
  } as IApplicantsState,
  reducers: {
    setApplicants(state: IApplicantsState, {payload: applicants}: PayloadAction<IApplicant[]>) {
      return {...state, applicants };
    },
    updateApplicant: (state, {payload: applicant}: PayloadAction<Partial<IApplicant>>) => {
      const applicants = state.applicants.map(a => a.id === applicant.id? {...a, ...applicant} : a);
      return {...state, applicants};
    },
    setApplicant(state: IApplicantsState, {payload: applicant}: PayloadAction<IApplicant | undefined>) {
      return {...state, selectedApplicant: applicant};
    },
  }
});


export const { setApplicants, updateApplicant, setApplicant } = applicantsSlice.actions;

export const applicantsReducer = applicantsSlice.reducer;