import { FC, useContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import Apartment from './components/apartment/apartment'
import { Applicant } from './components/applicant/applicant'
import { ApplicantsList } from './components/applicants-list/applicants-list'
import SignIn from './components/sign-in/sign-in'
import SignUp from './components/sign-up/sign-up'
import UserContext from './context/user-context'

export const Router: FC = () => {
  const { user } = useContext(UserContext);
  
  const authRoutes = (
    <Route>
      <Route path="/applicant" element={<Applicant />} />
      <Route path="/apartment" element={<Apartment />} />
      <Route path="/" element={<ApplicantsList />} />
    </Route>
  );

  const allRoutes = (
    <Routes>
      {/* private routes */}
      {user && authRoutes}

      {/* public routes */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="*" element={<SignIn />} />
    </Routes>
  );

  return allRoutes;
}