import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';
import { FC, useState } from 'react';
import { useHistory } from 'react-router';


const NavbarBackButton: FC<{sidebarOpen: boolean}> = ({sidebarOpen}) => {
  const [path, setpath] = useState<string>('');
  const history = useHistory();
  
  history.listen((location, action) => setpath(location.pathname));

  if (!sidebarOpen) {
    return (
      <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={path !== '/' && path !== ''? () => history.goBack() : undefined}
        >
          {path !== '/' && path !== ''?
          <ArrowBackIcon />
          :undefined}
        </IconButton>
    );
  } else {
    return <div />
  }
}

export default NavbarBackButton;