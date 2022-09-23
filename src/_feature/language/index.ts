import {createSlice, PayloadAction, current} from '@reduxjs/toolkit';

import {TYPE} from 'safeguard-corescript-npm';

// Language state type
interface Props extends TYPE.LanguageProps {
  loading: boolean;
}

// initial state of Language pack
const initialState: Props = {
  language: '',
  generatedDate: '',
  keyValues: {},
  loading: true,
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    // reset the state
    resetLanguage: () => initialState,
    // update the initial state of Language
    updateLangIntialState: (
      state: Props,
      action: PayloadAction<TYPE.LanguageProps>,
    ) => {
      current(state);
      state.generatedDate = action.payload.generatedDate;
      state.keyValues = action.payload.keyValues;
      state.language = action.payload.language;
      state.loading = false;
    },
  },
});

export const {updateLangIntialState, resetLanguage} = languageSlice.actions;
export default languageSlice.reducer;
