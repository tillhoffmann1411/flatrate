import { Badge, ListItem, ListItemIcon, Checkbox, ListItemAvatar, Avatar, ListItemText, Chip } from '@mui/material';
import { red, blue, orange, green } from '@mui/material/colors';
import { Box } from '@mui/system';
import { FC, useState } from 'react';
import { useHistory } from 'react-router-dom';
import IApplicant from '../../interfaces/applicant';
import { addApplicant, removeApplicant } from '../../redux/reducers/edit';
import { setFilter } from '../../redux/reducers/filter';
import { useAppDispatch, useAppSelector } from '../../redux/store';

import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import { calcRating } from './applicants-list.service';


export const ApplicantListItem: FC<{applicant: IApplicant}> = ({ applicant }) => {
  const states = [
    { title: 'rejected', color: red[700], icon: <CancelIcon />},
    { title: 'open', color: blue[700], icon: <Box />},
    { title: 'invited', color: orange[700], icon: <InsertInvitationIcon />},
    { title: 'accpeted', color: green[700], icon: <CheckCircleIcon />},
  ]
  const history = useHistory();
  const dispatch = useAppDispatch();
  const applicantStatus = states.find(s => s.title === applicant.status);
  const editMode = useAppSelector(state => state.editReducer.editMode);
  const [checked, setChecked] = useState<boolean>(false);

  const handleClick = () => {
    dispatch(setFilter({position: window.scrollY}));
    history.push('/applicant/' + applicant.id);
  };

  const getBadge = () => {
    if (applicantStatus) {
      return applicantStatus.icon
    } else {
      return <Badge color="secondary" badgeContent=" " />
    }
  }

  const handleCheck = () => {
    setChecked(!checked);
    if (!checked) {
      dispatch(addApplicant(applicant));
    } else {
      dispatch(removeApplicant(applicant));
    }
  }
  return (
  <ListItem key={applicant.id} onClick={editMode? handleCheck : handleClick}>
    { editMode?
      <ListItemIcon>
        <Checkbox
          checked={checked}
          tabIndex={-1}
          disableRipple
          inputProps={{ 'aria-labelledby': applicant.id }}
        />
      </ListItemIcon>
    : undefined}
    <ListItemAvatar>
      { applicantStatus ?
        <Badge
        overlap="circular"
        sx={{ color: applicantStatus.color, bgcolor: 'white' }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={getBadge()}
        >
        <Avatar alt={applicant.name} src={applicant.imageUrl} />
      </Badge>
      :
      <Avatar alt={applicant.name} src={applicant.imageUrl} />
    }
    </ListItemAvatar>
    <ListItemText primary={applicant.name}/>
    <GenderChip gender={applicant.gender} />
    <Chip size="small" className={'score-chip'} label={calcRating(applicant.ratings)}/>
  </ListItem>)
}


const GenderChip: FC<{gender?: string}> = ({gender}) => {
  if (!gender) {
    return <span></span>;
  }
  const genderColor = gender === "male" || gender === 'Männlich' ? "primary" : "secondary";
  const genderLabel = gender === "male" || gender === 'Männlich' ? "M" : "W";
  return <Chip size="small" color={genderColor} label={genderLabel}/>;
}