import { AppBar, CssBaseline, IconButton, makeStyles, Toolbar, Typography } from '@material-ui/core';
import './App.css';
import { ApplicantsList } from './components/applicants-list/applicants-list';
import { initializeApp } from 'firebase/app';
import IApplicant from './interfaces/applicant';
import { get, getDatabase, ref } from 'firebase/database';
import { useEffect } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { Applicant } from './components/applicant/applicant';
import React from 'react';
import {firebaseEnv} from './env';
import { setApplicants } from './redux/reducers/applicants';
import { useAppDispatch } from './redux/store';

const firebaseConfig = {
  apiKey: firebaseEnv.key,
  authDomain: firebaseEnv.auth,
  databaseURL: firebaseEnv.dbUrl,
  projectId: firebaseEnv.project,
  storageBucket: firebaseEnv.storage,
  messagingSenderId: firebaseEnv.msgId,
  appId: firebaseEnv.appId,
  measurementId: firebaseEnv.measureId
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function ElevationScroll(props: React.PropsWithChildren<any>) {
  return React.cloneElement(props.children, {
    elevation: 0,
  });
}

function App() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchApplicants = async () => {
      const dbRef = ref(db, 'applicants');
      const snapshot = await get(dbRef);
      const tempappl: IApplicant[] = [];
      snapshot.forEach((applicantSnap: any) => {
        tempappl.push(applicantSnap.val())
      });
      dispatch(setApplicants(tempappl));
    };
    fetchApplicants();
  }, [dispatch]);
  
  return (
    <React.Fragment>
      <header>
        <CssBaseline />
        <ElevationScroll>
          <AppBar position="static">
            <Toolbar>
              <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              </IconButton>
              <Typography variant="h6" className={classes.title} onClick={() => history.push('/')}>
                flatrate
              </Typography>
            </Toolbar>
          </AppBar>
        </ElevationScroll>
      </header>

      <main className="App-main">
        <Switch>
          <Route path="/applicant/:id" render={({match}) => {
              return <Applicant id={match.params.id}/>
            }}>
          </Route>

          <Route path="/">
            <ApplicantsList></ApplicantsList>
          </Route>
          </Switch>
      </main>
    </React.Fragment>
  );
}

export default App;