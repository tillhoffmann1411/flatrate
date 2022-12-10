import './styles/App.css';
import { FC, useEffect, useState } from 'react';
import React, { useContext } from 'react';

import { IAuthUser } from './interfaces/user';
import Navbar from './components/utils/navbar/navbar';
import LoadingSpinner from './components/utils/loading-spinner/loading-spinner';
import Sidebar from './components/utils/sidebar/sidebar';
import Main from './components/utils/main/main';
import { Router } from './Router';
import { ApplicantService } from './services/applicant.service';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import UserContext from './context/user-context';
import ApartmentContext from './context/apartment-context';
import { ApartmentService } from './services/apartment.service';
import ApplicantsContext from './context/applicants-context';

const App: FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const { setUser } = useContext(UserContext);
  const { setApartment } = useContext(ApartmentContext);
  const { setApplicants } = useContext(ApplicantsContext);

  const openSidebar = () => {
    setOpen(true);
  };

  const closeSidebar = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchApplicants = async (apartmentId: string) => {
      const tempappl = (await ApplicantService.getApplicants(apartmentId)).filter(a => a);
      setApplicants(tempappl);
    };

    const getCurrentUser = () => {
      AuthService.onAuthStateChanged(async (authUser: IAuthUser | undefined) => {
        setIsLoading(true);
        if (authUser) {
          const loadedUser = await UserService.getUser(authUser.id);
          setUser(loadedUser);
          if (loadedUser && loadedUser.apartmentId) {
            const loadedApartment = await ApartmentService.get(loadedUser.apartmentId);
            setApartment(loadedApartment)
            await fetchApplicants(loadedUser.apartmentId);
          }
        }
        setIsLoading(false);
      });
    }


    getCurrentUser();
  }, [setApplicants, setIsLoading, setUser, setApartment]);

  if (isLoading) {
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