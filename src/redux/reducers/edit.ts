import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IApplicant from '../../interfaces/applicant';

interface IEditState {
  selectedApplicants: IApplicant[],
  editMode: boolean,
}

const editSlice = createSlice({
  name: 'edit',
  initialState: {
    selectedApplicants: [],
    editMode: false,
  } as IEditState,
  reducers: {
    addApplicant(state: IEditState, {payload: applicant}: PayloadAction<IApplicant>) {
      return {...state, selectedApplicants: [...state.selectedApplicants, applicant] };
    },
    removeApplicant: (state, {payload: applicant}: PayloadAction<Partial<IApplicant>>) => {
      const newSelectedApplicants = state.selectedApplicants.filter(a => a.id !== applicant.id);
      return {...state, selectedApplicants: newSelectedApplicants};
    },
    finishEditMode(state: IEditState) {
      return { editMode: false, selectedApplicants: []};
    },
    startEditMode(state: IEditState) {
      return { editMode: true, selectedApplicants: []};
    }
  }
});


export const { addApplicant, removeApplicant, finishEditMode, startEditMode } = editSlice.actions;

export const editReducer = editSlice.reducer;