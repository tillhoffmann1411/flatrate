import { AppBar, Box, CssBaseline, IconButton, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography, Drawer } from '@mui/material';
import './App.css';
import { ApplicantsList } from './components/applicants-list/applicants-list';
import { initializeApp } from 'firebase/app';
import IApplicant from './interfaces/applicant';
import { get, getDatabase, ref, update } from 'firebase/database';
import { FC, useEffect, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { Applicant } from './components/applicant/applicant';
import React from 'react';
import {firebaseEnv} from './env';
import { setApplicants, updateApplicant } from './redux/reducers/applicants';
import { useAppDispatch, useAppSelector } from './redux/store';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import { finishEditMode, startEditMode } from './redux/reducers/edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';
import { red, blue, orange, green } from '@mui/material/colors';

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

  
  return (
    <React.Fragment>
      <header>
        <CssBaseline />
          <AppBar position="fixed">
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
              <IconButton
                size="large"
                color="inherit"
                aria-label="synchronize"
                sx={{ mr: 2 }}
                onClick={handleSynch}
              >
                <ArrowBackIcon />
              </IconButton>
              <EditButton />
            </Toolbar>
          </AppBar>
          <Toolbar sx={{mb: 2}} />
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

const EditButton: FC = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const editState = useAppSelector(state => state.editReducer);
  const path = history.location.pathname;

  if (path !== '/') {
    return <div></div>
  }

  const handleEditClick = () => {
    if (!editState.editMode) {
      dispatch(startEditMode());
    }
  }

  const handleOptionsClick = (mode: string) => {
    if (editState.editMode) {
      updateAllApplicants(editState.selectedApplicants, mode);
      dispatch(finishEditMode());
    }
  }

  const updateAllApplicants = async (applicants: IApplicant[], status: string) => {
    applicants.forEach(async (applicant) => {
      const newApplicant = {...applicant, status: status as IApplicant['status']};
      await updateApplicantStatus(newApplicant);
      dispatch(updateApplicant(newApplicant));
    });
  }

  if (editState.editMode) {
    return <EditDrawer selectedMode={(mode) => handleOptionsClick(mode)} />
  } else {
    return <IconButton
      size="large"
      edge="end"
      color="inherit"
      aria-label="edit"
      onClick={handleEditClick}
    >
      <EditIcon />
    </IconButton>
  }
}

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


const EditMenu: FC<{toggleDrawer: (open: boolean) => void, selectedMode: (mode: string) => void}> = ({toggleDrawer, selectedMode}) => {
  const states = [
    { title: 'rejected', color: red[700], icon: <CancelIcon />},
    { title: 'open', color: blue[700], icon: <ThumbsUpDownIcon />},
    { title: 'invited', color: orange[700], icon: <InsertInvitationIcon />},
    { title: 'accpeted', color: green[700], icon: <CheckCircleIcon />},
  ]

  const handleClick = (mode: string) => {
    selectedMode(mode);
  }
  return (
  <Box
    sx={{ width: 'auto' }}
    role="presentation"
    onClick={() => toggleDrawer(false)}
    onKeyDown={() => toggleDrawer(false)}
  >
    <List>
      {states.map((state, index) => (
        <ListItem button key={state.title} sx={{ color: state.color }} onClick={() => handleClick(state.title)}>
          <ListItemIcon sx={{ color: state.color }}>
            {state.icon}
          </ListItemIcon>
          <ListItemText primary={state.title} />
        </ListItem>
      ))}
      <ListItem button key={'cancel'} onClick={() => handleClick('')}>
          <ListItemText primary={'Abbrechen'} />
        </ListItem>
    </List>
  </Box>)
};

const updateApplicantStatus = async (applicant: IApplicant) => {
  const dbRef = ref(db, 'applicants/' + applicant.id);
  await update(dbRef, applicant);
};

const handleSynch = async () => {
  const res = await fetch('http://localhost:8080/', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: 'maike-simon1@web.de',
      secondParam: 'RHW3092022',
    })
  });

  console.log(res);
}

export default App;