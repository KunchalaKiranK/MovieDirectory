import {TYPE, activatedBy} from 'safeguard-corescript-npm';
import {store} from '../_app';

const activatedByCheck = (
  props: TYPE.ActivatedByProps[],
  scriptType: string,
) => {
  let QUESTION_LIST: TYPE.QusetionsProps =
    store.getState().script.survey.questions;
  let LUGGAGE: TYPE.LuggageProps = store.getState().luggage;
  let LANGUAGE = store.getState().lang.keyValues;
  let STATIONS = store.getState().script.survey.stationData;
  return activatedBy(props, QUESTION_LIST, LUGGAGE, LANGUAGE, STATIONS);
};

export {activatedByCheck};
