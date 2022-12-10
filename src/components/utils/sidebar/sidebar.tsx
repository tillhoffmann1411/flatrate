import { Drawer, Divider, List, ListItem, ListItemIcon, ListItemText, useTheme, styled, Button } from '@mui/material';
import { FC, useContext } from 'react';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import GroupsIcon from '@mui/icons-material/Groups';
import CreateIcon from '@mui/icons-material/Create';
import UserContext from '../../../context/user-context';
import ApartmentContext from '../../../context/apartment-context';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../../services/auth.service';
import ApplicantsContext from '../../../context/applicants-context';

const drawerWidth = 300;

const Sidebar: FC<{sidebarOpen: boolean, openSidebar: () => void, closeSidebar: () => void}> = ({sidebarOpen, openSidebar, closeSidebar}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const { setApartment } = useContext(ApartmentContext);
  const { setApplicants, setEditMode } = useContext(ApplicantsContext);
  
  const logout = async () => {
    await AuthService.signOut();
    setUser(undefined)
    setApartment(undefined);
    setApplicants([]);
    setEditMode(false);
    closeSidebar();
    navigate('/signin')
  };

  const handleClick: (path: string, cb?: () => void) => void = (path, cb?) => {
    if (path !== '') {
      navigate(path);
    } else if (cb) {
      cb();
    }
    closeSidebar();
  }
  
  const options = [
    { title: 'Bewerber',  icon: <FormatListBulletedIcon />, cb: () => handleClick('/'), auth: true },
    { title: 'WG', icon: <GroupsIcon />, cb: () => handleClick('/apartment'), auth: true },
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
            if (option.auth === !!user && !(user && option.title === 'Bewerber' && user.apartmentId === undefined)) {
              return (
                <ListItem key={option.title} onClick={option.cb}>
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