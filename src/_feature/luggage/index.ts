import {createSlice, PayloadAction, current} from '@reduxjs/toolkit';

import {TYPE} from 'safeguard-corescript-npm';

// Luggage state type
interface Props extends TYPE.LuggageProps {
  loading: boolean;
  scriptHashes: {
    hash: string;
    name: string;
    sort: number;
    value: string;
  }[];
}

// initial state of Luggage pack
const initialState: Props = {
  scriptHash: '',
  Luggages: {},
  loading: true,
  scriptHashes: [],
};

const luggageSlice = createSlice({
  name: 'luggage',
  initialState,
  reducers: {
    // reset the state
    resetLuggage: () => initialState,

    // update the intial state of Language
    updateLuggageIntialState: (state: Props, action: PayloadAction<any>) => {
      current(state);
      state.scriptHash = action.payload.scriptHash;
      state.Luggages = action.payload.Luggages;
      state.loading = false;
      state.scriptHashes = action.payload.scriptHashes;
    },
  },
});

export const {resetLuggage, updateLuggageIntialState} = luggageSlice.actions;
export default luggageSlice.reducer;
