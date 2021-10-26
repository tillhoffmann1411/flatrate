import './styles/App.css';
import { FC, useEffect, useState } from 'react';
import React from 'react';
import { setApplicants } from './redux/reducers/applicants';
import { useAppDispatch } from './redux/store';

import { FirebaseService } from './services/firebase.service';
import { setUser } from './redux/reducers/user';
import { IUser } from './interfaces/user';
import Navbar from './components/utils/navbar/navbar';
import LoadingSpinner from './components/utils/loading-spinner/loading-spinner';
import Sidebar from './components/utils/sidebar/sidebar';
import Main from './components/utils/main/main';
import { Router } from './Router';

const App: FC = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = React.useState(false);

  const openSidebar = () => {
    setOpen(true);
  };

  const closeSidebar = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchApplicants = async () => {
      const tempappl = await FirebaseService.getApplicants();
      dispatch(setApplicants(tempappl));
    };
    const getCurrentUser = () => {
      FirebaseService.onAuthStateChanged(async (user: IUser | undefined) => {
        if (user) {
          dispatch(setUser(user));
          await fetchApplicants();
        }
        setLoading(false);
      });
    }
    setLoading(true);
    getCurrentUser();
  }, [dispatch]);

  if (loading) {
    return <LoadingSpinner />
  } else {
    return (
      <React.Fragment>
        
        <Navbar sidebarOpen={open} openSidebar={openSidebar} closeSidebar={closeSidebar} />
        
        <Sidebar sidebarOpen={open} openSidebar={openSidebar} closeSidebar={closeSidebar} />

        <Main sidebarOpen={open} child={<Router />} />
      </React.Fragment>
    );
  }
}

export default App;