import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';
import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const NavbarBackButton: FC<{sidebarOpen: boolean}> = ({sidebarOpen}) => {
  const [path, setpath] = useState<string>('');
  const navigate = useNavigate();
  
  if (!sidebarOpen) {
    return (
      <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={path !== '/' && path !== ''? () => navigate(-1) : undefined}
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