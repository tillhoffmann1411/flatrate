import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IUser } from '../../interfaces/user';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

interface IUserState {
  user: IUser | undefined,
  loggedIn: boolean,
  loading: boolean
}

const initialState = {
  user: undefined,
  loggedIn: false,
  loading: false
}

type UserError = {
  msg: string;
};


export const signIn = createAsyncThunk<
  IUser | undefined,
  { email: string, password: string },
  { rejectValue: UserError }
  >(
  'user/signIn',
  async (cred, thunkApi) => {
    let user = undefined
    try {
      const authUser = await AuthService.signIn(cred.email, cred.password);
      if (authUser) user = await UserService.getUser(authUser.id);
      if (user) return user;
      else throw new Error();
    } catch (e) {
      const msg = 'Error by signin: ' + e;
      console.log(msg);
      thunkApi.rejectWithValue({msg});
    }
  }
);

export const signUp = createAsyncThunk<
  IUser | undefined,
  { firstName: string, lastName: string, email: string, password: string },
  { rejectValue: UserError }
  >(
  'user/signUp',
  async (cred, thunkApi) => {
    let user = undefined
    try {
      const authUser = await AuthService.signUp(cred.firstName, cred.lastName, cred.email, cred.password);
      if (authUser) user = await UserService.create({
        id: authUser.id,
        email: cred.email,
        firstName: cred.firstName,
        lastName: cred.lastName,
        apartment: undefined,
        createdAt: new Date()
      });
      if (user) return user;
      else throw new Error();
    } catch (e) {
      const msg = 'Error by signup: ' + e;
      console.log(msg);
      thunkApi.rejectWithValue({msg});
    }
  }
);

export const loadUser = createAsyncThunk<
  IUser | undefined,
  { id: string },
  { rejectValue: UserError }
  >(
  'user/loadUser',
  async (cred, thunkApi) => {
    let user = undefined
    try {
      user = await UserService.getUser(cred.id);
      if (user) return user;
      else throw new Error();
    } catch (e) {
      const msg = 'Error by loadUser: ' + e;
      console.log(msg);
      thunkApi.rejectWithValue({msg});
    }
  }
);

export const signOut = createAsyncThunk<
  void,
  undefined,
  { rejectValue: UserError }
  >(
  'user/signOut',
  async (cred, thunkApi) => {
    try {
      await AuthService.signOut();
    } catch (e) {
      const msg = 'Error by signOut: ' + e;
      console.log(msg);
      thunkApi.rejectWithValue({msg});
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: { },
  extraReducers: (builder) => {

    // SignIn
    builder.addCase(signIn.pending, (state: IUserState) => {
      state.loading = true;
    });
    builder.addCase(signIn.fulfilled, (state: IUserState, { payload }) => {
      state.loading = false;
      state.loggedIn = !!payload;
      state.user = payload;
    });
    builder.addCase(signIn.rejected, (state: IUserState) => {
      state.loading = false;
      state.loggedIn = false;
      state.user = undefined;
    });

    // SignUp
    builder.addCase(signUp.pending, (state: IUserState) => {
      state.loading = true;
    });
    builder.addCase(signUp.fulfilled, (state: IUserState, { payload }) => {
      state.loading = false;
      state.loggedIn = !!payload;
      state.user = payload;
    });
    builder.addCase(signUp.rejected, (state: IUserState) => {
      state.loading = false;
      state.loggedIn = false;
      state.user = undefined;
    });
    
    // loadUser
    builder.addCase(loadUser.pending, (state: IUserState) => {
      state.loading = true;
    });
    builder.addCase(loadUser.fulfilled, (state: IUserState, { payload }) => {
      state.loading = false;
      state.loggedIn = !!payload;
      state.user = payload;
    });
    builder.addCase(loadUser.rejected, (state: IUserState) => {
      state.loading = false;
      state.loggedIn = false;
      state.user = undefined;
    });

    // SignOut
    builder.addCase(signOut.pending, (state: IUserState) => {
      state.loading = true;
    });
    builder.addCase(signOut.fulfilled, (state: IUserState) => {
      state.loading = false;
      state.loggedIn = false;
      state.user = undefined;
    });
    builder.addCase(signOut.rejected, (state: IUserState) => {
      state.loading = false;
      state.loggedIn = false;
      state.user = undefined;
    });

  },
});

export const userReducer = userSlice.reducer;

