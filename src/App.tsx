import './styles/App.css';
import { FC, useEffect } from 'react';
import React from 'react';
import { setApplicants } from './redux/reducers/applicants';
import { useAppDispatch, useAppSelector } from './redux/store';

import { loadUser } from './redux/reducers/user';
import { IAuthUser } from './interfaces/user';
import Navbar from './components/utils/navbar/navbar';
import LoadingSpinner from './components/utils/loading-spinner/loading-spinner';
import Sidebar from './components/utils/sidebar/sidebar';
import Main from './components/utils/main/main';
import { Router } from './Router';
import { ApplicantService } from './services/applicant.service';
import { AuthService } from './services/auth.service';
import { IApartment } from './interfaces/apartment';

const App: FC = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(state => state.userReducer.loading);
  const [open, setOpen] = React.useState(false);

  const openSidebar = () => {
    setOpen(true);
  };

  const closeSidebar = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchApplicants = async (apartmentId: string) => {
      const tempappl = await ApplicantService.getFirestoreApplicants(apartmentId);
      dispatch(setApplicants(tempappl));
    };
    const getCurrentUser = () => {
      AuthService.onAuthStateChanged(async (authUser: IAuthUser | undefined) => {
        if (authUser) {
          const disUser = (await dispatch(loadUser({ id: authUser.id }))) as any;
          if (disUser && disUser.payload && disUser.payload.apartment) {
            const apartment = disUser.payload.apartment as IApartment;
            await fetchApplicants(apartment.id);
          }
        }
      });
    }
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