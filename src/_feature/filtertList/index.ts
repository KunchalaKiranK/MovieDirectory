import {createSlice, current, PayloadAction} from '@reduxjs/toolkit';

export interface FilterListProp {
  clients?: string[];
  types?: string[];
  statuses?: string[];
  dueDates?: string[];
  progressStatuses?: string[];
  cities?: string[];
  states?: string[];
  assignments?: string[];
  tags?: string[];
}

interface FilterListProps {
  filterList: FilterListProp[];
}

const initialState = {
  filterList: [],
};

const filterListSlice = createSlice({
  name: 'filterList',
  initialState,
  reducers: {
    // reset the state
    resetFilterList: () => initialState,
    updateFilterListInitialState: (
      state: FilterListProps,
      action: PayloadAction<FilterListProp[]>,
    ) => {
      current(state);
      state.filterList = action.payload;
    },
  },
});

export const {updateFilterListInitialState, resetFilterList} =
  filterListSlice.actions;
export default filterListSlice.reducer;
