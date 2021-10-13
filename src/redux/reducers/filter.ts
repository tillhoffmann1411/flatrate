import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IFilterState {
  male: boolean,
  female: boolean,
  ranking: 'newest' | 'score',
  searchString: string,
  position: number
}

const filterSlice = createSlice({
  name: 'filter',
  initialState: {
    male: false,
    female: false,
    ranking: 'newest',
    searchString: '',
    position: 0
  } as IFilterState,
  reducers: {
    setFilter(state: IFilterState, {payload: filter}: PayloadAction<Partial<IFilterState>>) {
      if (filter.position) {
        return {...state, ...filter};
      } else {
        // To prevent scrolling when filter changes
        return {...state, ...filter, position: 0};
      }
    },
  }
});


export const { setFilter } = filterSlice.actions;

export const filterReducer = filterSlice.reducer;