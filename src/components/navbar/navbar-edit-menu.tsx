import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { red, blue, orange, green } from '@mui/material/colors';
import { Box } from '@mui/system';
import { FC } from 'react';

import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';


const EditMenu: FC<{toggleDrawer: (open: boolean) => void, selectedMode: (mode: string) => void}> = ({toggleDrawer, selectedMode}) => {
  const states = [
    { title: 'rejected', color: red[700], icon: <CancelIcon />},
    { title: 'open', color: blue[700], icon: <ThumbsUpDownIcon />},
    { title: 'invited', color: orange[700], icon: <InsertInvitationIcon />},
    { title: 'accpeted', color: green[700], icon: <CheckCircleIcon />},
  ]

  const handleClick = (mode: string) => {
    selectedMode(mode);
  }
  return (
  <Box
    sx={{ width: 'auto' }}
    role="presentation"
    onClick={() => toggleDrawer(false)}
    onKeyDown={() => toggleDrawer(false)}
  >
    <List>
      {states.map((state, index) => (
        <ListItem button key={state.title} sx={{ color: state.color }} onClick={() => handleClick(state.title)}>
          <ListItemIcon sx={{ color: state.color }}>
            {state.icon}
          </ListItemIcon>
          <ListItemText primary={state.title} />
        </ListItem>
      ))}
      <ListItem button key={'cancel'} onClick={() => handleClick('')}>
          <ListItemText primary={'Abbrechen'} />
        </ListItem>
    </List>
  </Box>)
};

export default EditMenu;