import {TYPE} from 'safeguard-corescript-npm';
import {activatedByCheck} from '../../utils';

import {store} from '../../_app';

interface OptionProps {
  value: string;
  label: string;
  Media?: any;
  Terminal?: string;
  Selected?: boolean;
}

const getSingleSelectOptionsData = (question: string) => {
  const LANGUAGE = store.getState().lang.keyValues;
  const QUESTION_INFO = store.getState().script.survey.questions[question];
  const {QuestionGroup, StationName} = QUESTION_INFO;

  const QUESTION_DETAILS: TYPE.QuestionProps = store
    .getState()
    .script.survey.stationData[StationName].QuestionGroups.filter(
      group => group.Name === QuestionGroup,
    )[0]
    .Questions.filter(ques => ques.Name === question)[0];

  let OPTIONS: OptionProps[] = [];
  if (QUESTION_DETAILS.Answers) {
    // loop on Answes
    QUESTION_DETAILS.Answers.forEach(item => {
      // check if it have activatedBy key and ActivatedBy return true
      if (item.ActivatedBy && activatedByCheck(item.ActivatedBy, 'survey')) {
        let value = item.Key;
        let label = LANGUAGE[item.Key] ? LANGUAGE[item.Key] : item.Key;
        if (item.Media) {
          OPTIONS.push({value, label, Media: item.Media});
        } else {
          OPTIONS.push({value, label: label});
        }
      }
      // check if ActivatedBy doesn't exist
      if (!item.ActivatedBy) {
        let value = item.Key;
        let label = LANGUAGE[item.Key] ? LANGUAGE[item.Key] : item.Key;
        if (item.Media) {
          OPTIONS.push({value, label, Media: item.Media});
        } else {
          OPTIONS.push({value, label});
        }
      }
    });
  }
  return {
    option: OPTIONS,
    questionProps: QUESTION_DETAILS,
    StationName,
    QuestionGroup,
    questionNames: question,
  };
};

const getMultiSelectOptionsData = (question: string) => {
  const LANGUAGE = store.getState().lang.keyValues;
  const QUESTION_INFO = store.getState().script.survey.questions[question];
  const {QuestionGroup, StationName, UserResponse} = QUESTION_INFO;

  const checkSelected = (label: string) => {
    if (UserResponse) {
      let selectedOption = UserResponse.map((item: any) => {
        return item[0];
      });
      return selectedOption.some((item: string) => item === label);
    }
    return false;
  };

  const QUESTION_DETAILS: TYPE.QuestionProps = store
    .getState()
    .script.survey.stationData[StationName].QuestionGroups.filter(
      group => group.Name === QuestionGroup,
    )[0]
    .Questions.filter(ques => ques.Name === question)[0];

  let OPTIONS: OptionProps[] = [];

  if (QUESTION_DETAILS.Answers) {
    // loop on Answes
    QUESTION_DETAILS.Answers.forEach(item => {
      let selected = checkSelected(item.Key);
      // check if it have activatedBy key and ActivatedBy return true
      if (item.ActivatedBy && activatedByCheck(item.ActivatedBy, 'survey')) {
        let value = item.Key;
        let label = LANGUAGE[item.Key] ? LANGUAGE[item.Key] : item.Key;
        if (item.Media) {
          OPTIONS.push({
            value,
            label,
            Terminal: item.Terminal ? item.Terminal : '',
            Media: item.Media,
            Selected: selected,
          });
        } else {
          OPTIONS.push({
            value,
            label,
            Terminal: item.Terminal ? item.Terminal : '',
            Selected: selected,
          });
        }
      }
      // check if ActivatedBy doesn't exist
      if (!item.ActivatedBy) {
        let value = item.Key;
        let label = LANGUAGE[item.Key] ? LANGUAGE[item.Key] : item.Key;
        if (item.Media) {
          OPTIONS.push({
            value,
            label,
            Terminal: item.Terminal ? item.Terminal : '',
            Media: item.Media,
            Selected: selected,
          });
        } else {
          OPTIONS.push({
            value,
            label,
            Terminal: item.Terminal ? item.Terminal : '',
            Selected: selected,
          });
        }
      }
    });
  }
  return {
    option: OPTIONS,
    questionProps: QUESTION_DETAILS,
    StationName,
    QuestionGroup,
    questionNames: question,
  };
};

export {getSingleSelectOptionsData, getMultiSelectOptionsData};
