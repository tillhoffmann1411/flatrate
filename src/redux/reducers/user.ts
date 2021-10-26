import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '../../interfaces/user';

interface IUserState {
  user: IUser | undefined,
  loggedIn: boolean
}

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: undefined,
    loggedIn: false
  } as IUserState,
  reducers: {
    signIn(state: IUserState, {payload: user}: PayloadAction<IUser>) {
      return {...state, loggedIn: true, user };
    },
    signUp: (state: IUserState, {payload: user}: PayloadAction<IUser>) => {
      return {...state, loggedIn: true, user};
    },
    signOut(state: IUserState) {
      return {...state, user: undefined, loggedIn: false};
    },
    setUser(state: IUserState, {payload: user}: PayloadAction<IUser>) {
      return {...state, loggedIn: true, user };
    },
  }
});


export const { signIn, signUp, signOut, setUser } = userSlice.actions;

export const userReducer = userSlice.reducer;