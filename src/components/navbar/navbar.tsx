import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import { FC, useState } from 'react';
import EditButton from './navbar-edit-button';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SyncIcon from '@mui/icons-material/Sync';
import { useHistory } from 'react-router-dom';



const Navbar: FC = () => {
  const history = useHistory();
  const [path, setpath] = useState<string>('');
  history.listen((location, action) => setpath(location.pathname));

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

  return (
    <Box>
      <AppBar position="fixed">
        <Toolbar>
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
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} onClick={() => history.push('/')}>
            flatrate
          </Typography>
          <IconButton
            size="large"
            color="inherit"
            aria-label="synchronize"
            sx={{ mr: 2 }}
            onClick={handleSynch}
          >
            <SyncIcon />
          </IconButton>
          <EditButton />
        </Toolbar>
      </AppBar>
      <Toolbar />
    </Box>
  );
}

export default Navbar;