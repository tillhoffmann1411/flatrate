import { styled } from '@mui/material';
import { FC, ReactElement } from 'react';

const Main: FC<{sidebarOpen: boolean, child: ReactElement}> = ({ sidebarOpen, child }) => {
  return (
    <MainStyle open={sidebarOpen}>
      {child}
    </MainStyle>
  );
}

const MainStyle = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(1),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  //marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

export default Main;