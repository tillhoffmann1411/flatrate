import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { combineReducers, createStore } from '@reduxjs/toolkit';
import { applicantsReducer } from './reducers/applicants';
import { filterReducer } from './reducers/filter';
import { editReducer } from './reducers/edit';
import { userReducer } from './reducers/user';
// import { composeWithDevTools } from '@reduxjs/toolkit/dist/devtoolsExtension';

// const composedEnhancers = composeWithDevTools();
export const store =  createStore(combineReducers({
  applicantsReducer,
  filterReducer,
  editReducer,
  userReducer
}));




// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch


// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector