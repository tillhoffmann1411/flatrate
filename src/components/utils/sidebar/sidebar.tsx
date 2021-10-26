import { Drawer, Divider, List, ListItem, ListItemIcon, ListItemText, useTheme, styled, Button, Box } from '@mui/material';
import { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { FirebaseService } from '../../../services/firebase.service';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { signOut } from '../../../redux/reducers/user';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import LogoutIcon from '@mui/icons-material/Logout';
import SyncIcon from '@mui/icons-material/Sync';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import GroupsIcon from '@mui/icons-material/Groups';
import CreateIcon from '@mui/icons-material/Create';

const drawerWidth = 300;

const Sidebar: FC<{sidebarOpen: boolean, openSidebar: () => void, closeSidebar: () => void}> = ({sidebarOpen, openSidebar, closeSidebar}) => {
  const theme = useTheme();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const loggedIn = useAppSelector(state => state.userReducer.loggedIn);
  
  const logout = async () => {
    await FirebaseService.signOut();
    dispatch(signOut());
    closeSidebar();
  };

  const handleSynch = async () => {
    const res = await fetch('http://localhost:8080/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'maike-simon1@web.de',
        secondParam: 'RHW3092022',
      })
    });
    console.log(res);
  }

  const handleClick: (path: string, cb?: () => void) => void = (path, cb?) => {
    if (path !== '') {
      history.push(path);
    } else if (cb) {
      cb();
    }
    closeSidebar();
  }
  
  const options = [
    { title: 'Bewerber',  icon: <FormatListBulletedIcon />, cb: () => handleClick('/'), auth: true },
    { title: 'Synchronisieren', icon: <SyncIcon />, cb: () => handleClick('', handleSynch), auth: true },
    { title: 'Profile', icon: <PersonIcon />, cb: () => handleClick('/profile'), auth: true },
    { title: 'WG', icon: <GroupsIcon />, cb: () => handleClick('/wg'), auth: true },
    { title: 'Logout', icon: <LogoutIcon />, cb: () => handleClick('', logout), auth: true },
    { title: 'Login', icon: <LoginIcon />, cb: () => handleClick('/signin'), auth: false },
    { title: 'Registrieren', icon: <CreateIcon />, cb: () => handleClick('/signup'), auth: false },
  ];


  return (
    <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={sidebarOpen}
      >
        <DrawerHeader>
          <Button endIcon={theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}onClick={closeSidebar}>
            Schließen
          </Button>
        </DrawerHeader>
        <Divider />
        <List>
          {options.map((option, index) => {
            if (option.auth === loggedIn) {
              return (
                <ListItem button key={option.title} onClick={option.cb}>
                  <ListItemIcon>
                    {option.icon}
                  </ListItemIcon>
                  <ListItemText primary={option.title} />
                </ListItem>
              )
            } else {
              return undefined;
            }
        })}
        </List>
      </Drawer>
  );
}

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default Sidebar;