import { Toolbar, IconButton, Typography, CssBaseline, styled } from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { useHistory } from 'react-router-dom';
import { FC } from 'react';

import EditButton from './navbar-edit-button';

import MenuIcon from '@mui/icons-material/Menu';
// import NavbarBackButton from './navbar-back-button';

const drawerWidth = 300;

const Navbar: FC<{sidebarOpen: boolean, openSidebar: () => void, closeSidebar: () => void}> = ({sidebarOpen, openSidebar, closeSidebar}) => {
  const history = useHistory();
  return (
    <header>
      <CssBaseline />
      <AppBar position="fixed" open={sidebarOpen}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={openSidebar}
            edge="start"
            sx={{ mr: 2, ...(sidebarOpen && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>

          {/* <NavbarBackButton sidebarOpen={sidebarOpen} /> */}
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }} onClick={() => history.push('/')}>
            flatrate
          </Typography>

          {sidebarOpen? undefined :
            <EditButton />
          }
        </Toolbar>
      </AppBar>
      <Toolbar />
    </header>
  );
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

export default Navbar;