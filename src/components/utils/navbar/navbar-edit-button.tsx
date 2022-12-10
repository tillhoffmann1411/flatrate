import { IconButton } from '@mui/material';
import { FC, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import IApplicant from '../../../interfaces/applicant';
import EditDrawer from './navbar-edit-drawer';

import EditIcon from '@mui/icons-material/Edit';
import ApplicantsContext from '../../../context/applicants-context';


const EditButton: FC = () => {
  const navigate = useNavigate();
  const { editMode, setEditMode } = useContext(ApplicantsContext);

  const handleEditClick = () => {
    if (!editMode) {
      setEditMode(true);
    }
  }

  const handleOptionsClick = (mode: string) => {
    if (editMode) {
      console.log('options');
      //updateAllApplicants(editState.selectedApplicants, mode);
      //dispatch(finishEditMode());
    }
  }

  const updateAllApplicants = async (applicants: IApplicant[], status: string) => {
    applicants.forEach(async (applicant) => {
      const newApplicant = {...applicant, status: status as IApplicant['status']};
      console.log(newApplicant);
      //await ApplicantService.updateFirestoreApplicant(newApplicant);
      //dispatch(updateApplicant(newApplicant));
    });
  }

  if (editMode) {
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