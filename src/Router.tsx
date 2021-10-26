import { FC } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { Applicant } from './components/applicant/applicant'
import { ApplicantsList } from './components/applicants-list/applicants-list'
import SignIn from './components/sign-in/sign-in'
import SignUp from './components/sign-up/sign-up'
import PrivateRoute from './PrivateRoute'


export const Router: FC = () => {
  return (
    <Switch>
      <Route path="/signin" component={SignIn} />
      <Route path="/signup" component={SignUp} />

      <PrivateRoute path="/applicant/:id" render={({match}) => {
        if (match.params.id) {
          return <Applicant id={match.params.id}/>
        } else {
          return <Redirect to={'/'} />
        }
      }} />
      <PrivateRoute path="/" component={ApplicantsList} />
    </Switch>
  )
}