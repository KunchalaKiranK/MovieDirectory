import {handleSaveTransport, TYPE} from 'safeguard-corescript-npm';
import {store} from '../_app';

const transport = (
  scriptType: string,
  station?: {[key: string]: TYPE.StationProps},
) => {
  let LUGGAGE: TYPE.LuggageProps = store.getState().luggage;
  let LANGUAGE: {[key: string]: string} = store.getState().lang.keyValues;
  let ImageData: {
    [key: string]: {[key: string]: {media: any; response: any}};
  } = store.getState().gallery.mediaInScript;

  if (scriptType === 'survey') {
    let QUESTION_LIST: TYPE.QusetionsProps =
      store.getState().script.survey.questions;
    let ALL_STATION_DATA: {[key: string]: TYPE.StationProps} =
      store.getState().script.survey.stationData;
    let STATIONS: {[key: string]: TYPE.StationProps} = station
      ? station
      : ALL_STATION_DATA;

    return handleSaveTransport(
      STATIONS,
      QUESTION_LIST,
      LUGGAGE,
      LANGUAGE,
      ImageData,
      ALL_STATION_DATA,
    );
  }
  let QUESTION_LIST: TYPE.QusetionsProps =
    store.getState().script.additional.questions;
  let ALL_STATION_DATA: {[key: string]: TYPE.StationProps} =
    store.getState().script.additional.stationData;
  let STATIONS: {[key: string]: TYPE.StationProps} = station
    ? station
    : ALL_STATION_DATA;

  return handleSaveTransport(
    STATIONS,
    QUESTION_LIST,
    LUGGAGE,
    LANGUAGE,
    ImageData,
    ALL_STATION_DATA,
  );
};

export {transport};
