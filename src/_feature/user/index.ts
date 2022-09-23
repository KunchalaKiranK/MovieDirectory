import {createSlice, PayloadAction, current} from '@reduxjs/toolkit';

// User data types
interface Props {
  user: string;
  orderNumber: string;
  bottomSheetModal: {
    station: boolean;
    singleSelect: boolean;
    multiSelect: boolean;
    mediaAtSurvey: boolean;
  };
  currentQuestion: string;
  questionChange: string;
  currentStation: string;
  stationChange: string;
  loading: boolean;
}

// initial state of user's data
const initialState: Props = {
  user: '',
  orderNumber: '',
  bottomSheetModal: {
    station: false,
    singleSelect: false,
    multiSelect: false,
    mediaAtSurvey: false,
  },
  currentQuestion: '',
  questionChange: '',
  currentStation: '',
  stationChange: '',
  loading: false,
};

const userSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    // reset the state
    resetUser: () => initialState,
    // update intial state of user data
    updateUserIntialState: (
      state: Props,
      action: PayloadAction<{
        user?: string;
        orderNumber?: string;
      }>,
    ) => {
      current(state);
      state = Object.assign(state, action.payload);
    },
    updateBottomSheetStatus: (
      state: Props,
      action: PayloadAction<{
        status: boolean;
        type: string;
      }>,
    ) => {
      let {status, type} = action.payload;
      current(state);
      if (type === 'station') {
        state.bottomSheetModal.station = status;
        state.bottomSheetModal.singleSelect = false;
        state.bottomSheetModal.multiSelect = false;
        state.bottomSheetModal.mediaAtSurvey = false;
      }
      if (type === 'singleSelect') {
        state.bottomSheetModal.station = false;
        state.bottomSheetModal.singleSelect = status;
        state.bottomSheetModal.multiSelect = false;
        state.bottomSheetModal.mediaAtSurvey = false;
      }
      if (type === 'multiSelect') {
        state.bottomSheetModal.station = false;
        state.bottomSheetModal.singleSelect = false;
        state.bottomSheetModal.multiSelect = status;
        state.bottomSheetModal.mediaAtSurvey = false;
      }
      if (type === 'mediaAtSurvey') {
        state.bottomSheetModal.station = false;
        state.bottomSheetModal.singleSelect = false;
        state.bottomSheetModal.multiSelect = false;
        state.bottomSheetModal.mediaAtSurvey = status;
      }
    },
    updateCurrentQuestions: (state: Props, action: PayloadAction<string>) => {
      state.currentQuestion = action.payload;
      state.questionChange = JSON.stringify(Math.random());
    },
    updateCurrentStation: (state: Props, action: PayloadAction<string>) => {
      state.currentStation = action.payload;
      state.stationChange = JSON.stringify(Math.random());
    },
    updateLoadingStateOfUser: (
      state: Props,
      action: PayloadAction<boolean>,
    ) => {
      state.loading = action.payload;
    },
  },
});

export const {
  updateUserIntialState,
  resetUser,
  updateBottomSheetStatus,
  updateCurrentQuestions,
  updateCurrentStation,
  updateLoadingStateOfUser,
} = userSlice.actions;
export default userSlice.reducer;
