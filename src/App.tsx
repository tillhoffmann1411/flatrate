import { AppBar, CssBaseline, IconButton, Toolbar, Typography } from '@mui/material';
import './App.css';
import { ApplicantsList } from './components/applicants-list/applicants-list';
import { initializeApp } from 'firebase/app';
import IApplicant from './interfaces/applicant';
import { get, getDatabase, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { Applicant } from './components/applicant/applicant';
import React from 'react';
import {firebaseEnv} from './env';
import { setApplicants } from './redux/reducers/applicants';
import { useAppDispatch } from './redux/store';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


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


function ElevationScroll(props: React.PropsWithChildren<any>) {
  return React.cloneElement(props.children, {
    elevation: 0,
  });
}

function App() {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const [path, setpath] = useState<string>('');
  history.listen((location, action) => setpath(location.pathname));

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

  console.log(path);
  
  return (
    <React.Fragment>
      <header>
        <CssBaseline />
        <ElevationScroll>
          <AppBar position="static">
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