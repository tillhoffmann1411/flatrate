import { IconButton, Drawer } from '@mui/material';
import React, { FC, useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditMenu from './navbar-edit-menu';



const EditDrawer: FC<{ selectedMode: (mode: string) => void }> = ({selectedMode}) => {
  const [state, setState] = useState({mode: false});
  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setState({ ...state, mode: open });
  };

  return (
      <React.Fragment>
        <IconButton
          size="large"
          color="inherit"
          aria-label="options"
          onClick={toggleDrawer(true)}
        >
          <MoreVertIcon />
        </IconButton>
        <Drawer
          anchor={'bottom'}
          open={state.mode}
          onClose={toggleDrawer(false)}
          children={<EditMenu toggleDrawer={toggleDrawer} selectedMode={selectedMode} />}
        />
      </React.Fragment>
  );
}

export default EditDrawer;