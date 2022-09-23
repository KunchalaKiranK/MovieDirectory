import {createSlice, current, PayloadAction} from '@reduxjs/toolkit';

import {
  filterStationsName,
  formateStations,
  questionMapToStation,
  TYPE,
} from 'safeguard-corescript-npm';

// Script state types
interface ScriptProps {
  survey: {
    station: TYPE.StationArrayProps[];
    stationData: {[key: string]: TYPE.StationProps};
    questions: {
      [key: string]: {
        StationName: string;
        QuestionGroup: string;
        UserResponse: any;
        error: string;
      };
    };
  };
  additional: {
    station: TYPE.StationArrayProps[];
    stationData: {[key: string]: TYPE.StationProps};
    questions: {
      [key: string]: {
        StationName: string;
        QuestionGroup: string;
        UserResponse: any;
        error: string;
      };
    };
    scriptHash: string;
    scriptName: string;
  };
  intialRender: boolean;
  mediaSync: boolean;
  transportSync: boolean;
}

// initial state
const initialState: ScriptProps = {
  survey: {
    station: [],
    stationData: {},
    questions: {},
  },
  additional: {
    station: [],
    stationData: {},
    questions: {},
    scriptHash: '',
    scriptName: '',
  },
  intialRender: false,
  mediaSync: false,
  transportSync: false,
};

const scriptSlice = createSlice({
  name: 'script',
  initialState,
  reducers: {
    // reset the state
    resetScript: () => initialState,
    // update the initial state
    updateScriptInitialState: (
      state: ScriptProps,
      action: PayloadAction<{
        scriptType: string;
        data: TYPE.ScriptProps;
        scriptName?: string;
        scriptHash?: string;
      }>,
    ) => {
      let {data, scriptType} = action.payload;
      if (scriptType === 'survey') {
        state.survey.station = filterStationsName(data);
        state.survey.stationData = formateStations(data);
        state.survey.questions = questionMapToStation(data);
      } else {
        state.additional.station = filterStationsName(data);
        state.additional.stationData = formateStations(data);
        state.additional.questions = questionMapToStation(data);
        state.additional.scriptHash = action.payload.scriptHash
          ? action.payload.scriptHash
          : '';
        state.additional.scriptName = action.payload.scriptName
          ? action.payload.scriptName
          : '';
      }
    },
    // update user response and save within script
    updateTextResponse: (
      state: ScriptProps,
      action: PayloadAction<{
        scriptType: string;
        QuestionName: string;
        val: string[] | null;
        StationName?: string;
        QuestionGroupName?: string;
      }>,
    ) => {
      let {scriptType, QuestionName, val, StationName, QuestionGroupName} =
        action.payload;
      console.log(
        'text update at redux',
        QuestionName,
        StationName,
        QuestionGroupName,
      );
      current(state);
      if (scriptType === 'survey') {
        state.survey.questions[QuestionName].UserResponse = val;
        state.survey.stationData[`${StationName}`].QuestionGroups.filter(
          (item: any) => item.Name === QuestionGroupName,
        )[0].Questions.filter(
          (question: any) => question.Name === QuestionName,
        )[0].userResponse = val;
      } else {
        state.additional.questions[QuestionName].UserResponse = val;
        state.additional.stationData[`${StationName}`].QuestionGroups.filter(
          (item: any) => item.Name === QuestionGroupName,
        )[0].Questions.filter(
          (question: any) => question.Name === QuestionName,
        )[0].userResponse = val;
      }
    },
    // update error to each questions
    updateError: (
      state: ScriptProps,
      action: PayloadAction<{
        scriptType: string;
        QuestionName: string;
        error: string;
      }>,
    ) => {
      let {QuestionName, error, scriptType} = action.payload;
      current(state);
      if (scriptType === 'survey') {
        state.survey.questions[QuestionName].error = error;
      } else {
        state.additional.questions[QuestionName].error = error;
      }
    },
    // update the user response from User Luggage
    updateResponseFromTransport: (
      state: ScriptProps,
      action: PayloadAction<{
        scriptType: string;
        data: {scriptType: string; Name: string; Values: string[]}[];
      }>,
    ) => {
      current(state);
      let {data, scriptType} = action.payload;
      if (scriptType === 'survey') {
        data.forEach((item: {Name: string; Values: string[]}) => {
          let StationName = state.survey.questions[item.Name].StationName;
          let QuestionGroupName =
            state.survey.questions[item.Name].QuestionGroup;
          state.survey.stationData[`${StationName}`].QuestionGroups.filter(
            (i: any) => i.Name === QuestionGroupName,
          )[0].Questions.filter(
            (question: any) => question.Name === item.Name,
          )[0].userResponse = item.Values;

          if (!state.survey.questions[item.Name].UserResponse) {
            state.survey.questions[item.Name].UserResponse = item.Values;
          }
        });
      } else {
        data.forEach((item: {Name: string; Values: string[]}) => {
          let StationName = state.additional.questions[item.Name].StationName;
          let QuestionGroupName =
            state.additional.questions[item.Name].QuestionGroup;
          state.additional.stationData[`${StationName}`].QuestionGroups.filter(
            (i: any) => i.Name === QuestionGroupName,
          )[0].Questions.filter(
            (question: any) => question.Name === item.Name,
          )[0].userResponse = item.Values;

          if (!state.additional.questions[item.Name].UserResponse) {
            state.additional.questions[item.Name].UserResponse = item.Values;
          }
        });
      }
    },
  },
});

export const {
  resetScript,
  updateTextResponse,
  updateError,
  updateScriptInitialState,
  updateResponseFromTransport,
} = scriptSlice.actions;
export default scriptSlice.reducer;
