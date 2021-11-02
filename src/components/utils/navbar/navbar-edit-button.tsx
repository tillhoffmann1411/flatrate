import { IconButton } from '@mui/material';
import { FC } from 'react';
import { useHistory } from 'react-router-dom';
import IApplicant from '../../../interfaces/applicant';
import { updateApplicant } from '../../../redux/reducers/applicants';
import { startEditMode, finishEditMode } from '../../../redux/reducers/edit';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { ApplicantService } from '../../../services/applicant.service';
import EditDrawer from './navbar-edit-drawer';

import EditIcon from '@mui/icons-material/Edit';


const EditButton: FC = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const editState = useAppSelector(state => state.editReducer);
  const path = history.location.pathname;

  if (path !== '/') {
    return <div></div>
  }

  const handleEditClick = () => {
    if (!editState.editMode) {
      dispatch(startEditMode());
    }
  }

  const handleOptionsClick = (mode: string) => {
    if (editState.editMode) {
      updateAllApplicants(editState.selectedApplicants, mode);
      dispatch(finishEditMode());
    }
  }

  const updateAllApplicants = async (applicants: IApplicant[], status: string) => {
    applicants.forEach(async (applicant) => {
      const newApplicant = {...applicant, status: status as IApplicant['status']};
      await ApplicantService.updateApplicant(newApplicant);
      dispatch(updateApplicant(newApplicant));
    });
  }

  if (editState.editMode) {
    return <EditDrawer selectedMode={(mode) => handleOptionsClick(mode)} />
  } else {
    return <IconButton
      size="large"
      edge="end"
      color="inherit"
      aria-label="edit"
      onClick={handleEditClick}
    >
      <EditIcon />
    </IconButton>
  }
}

export default EditButton;