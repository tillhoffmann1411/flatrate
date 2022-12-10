import { Badge, ListItem, ListItemIcon, Checkbox, ListItemAvatar, Avatar, ListItemText, Chip } from '@mui/material';
import { red, blue, orange, green } from '@mui/material/colors';
import { Box } from '@mui/system';
import { FC, useContext, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import IApplicant from '../../interfaces/applicant';

import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import { calcRating } from './applicants-list.service';
import ApplicantsContext from '../../context/applicants-context';


export const ApplicantListItem: FC<{applicant: IApplicant}> = ({ applicant }) => {
  const states = [
    { title: 'rejected', color: red[700], icon: <CancelIcon />},
    { title: 'open', color: blue[700], icon: <Box />},
    { title: 'invited', color: orange[700], icon: <InsertInvitationIcon />},
    { title: 'accpeted', color: green[700], icon: <CheckCircleIcon />},
  ]
  const navigate = useNavigate();
  const [_, setSearchParams] = useSearchParams();
  const { editMode, applicants} = useContext(ApplicantsContext);
  const [checked, setChecked] = useState<boolean>(false);

  const handleClick = () => {
    navigate({ pathname: '/applicant', search: '?id=' + applicant.id});
  };

  // const getBadge = () => {
  //   if (applicantStatus) {
  //     return applicantStatus.icon
  //   } else {
  //     return <Badge color="secondary" badgeContent=" " />
  //   }
  // }

  return (
  <ListItem key={applicant.id} onClick={ handleClick}>
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
      {/* { applicantStatus ?
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
    } */}
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