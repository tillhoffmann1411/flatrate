import { FC } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useAppSelector } from './redux/store';

const PrivateRoute: FC<React.ComponentProps<typeof Route>> = (props) => {
  const loggedin = useAppSelector(state => state.userReducer.loggedIn);
  return (
    <Route {...props}>
      {loggedin? props.children : <Redirect exact={true} to ={{pathname: '/signin', state: {from: props.location}}} />}
    </Route>
  )
}

export default PrivateRoute;