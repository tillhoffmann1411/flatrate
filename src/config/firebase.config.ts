import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import {firebaseEnv} from '../env';
import { getFirestore } from 'firebase/firestore';


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

export const auth = getAuth(app);

export const firestore = getFirestore(app);