import React, {useEffect, useState} from 'react';
import {
  saveDateFormat,
  handleValidate,
  TYPE,
  getPrePopulatedValue,
} from 'safeguard-corescript-npm';
import DatePicker from 'react-native-date-picker';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import {useAppDispatch, useAppSelector} from '../../_app';
import ErrorLabel from './ErrorLabel';
import RequiredLabel from './RequiredLabel';
import {updateError, updateTextResponse} from '../../_feature';

const DateField = (props: TYPE.QuestionProps) => {
  const {
    Name,
    StationName,
    QuestionGroupName,
    userResponse,
    Required,
    PrePopulate,
  } = props;

  const dispatch = useAppDispatch();

  // get the Language form store
  const LANGUAGE = useAppSelector(state => state.lang.keyValues);
  const LUGGAGE = useAppSelector(state => state.luggage);
  const errorMsg = useAppSelector(
    state => state.script.survey.questions[Name].error,
  );

  // map the key with language pack
  let NAME = LANGUAGE[Name] ? LANGUAGE[Name] : Name;

  // default value for input
  const initialValue = () => {
    // if prePopulate key exist then return respective value from luggage
    if (PrePopulate && PrePopulate.PrePopulatedBy.Type === 'Luggage') {
      let {Key, LuggageSource} = PrePopulate.PrePopulatedBy;
      let value = LuggageSource
        ? getPrePopulatedValue(LUGGAGE, Key, LuggageSource)[0]
        : 'DEFAULT';
      return value === 'DEFAULT'
        ? userResponse === null
          ? null
          : userResponse[0]
        : value;
    }
    return userResponse === null ? null : userResponse[0];
  };

  // component states
  const [userDate, setUserDate] = useState<string | null>(() => initialValue());
  const [error, setError] = useState<string>(errorMsg);
  const [open, setOpen] = useState<boolean>(false);

  // update value to store on focus change
  const handleChange = (d: Date) => {
    setUserDate(saveDateFormat(d));

    // validation and save the response
    let valid = handleValidate(props, [saveDateFormat(d)]);
    if (valid === 'true') {
      setError('');
      if ((userResponse ? userResponse[0] : null) !== saveDateFormat(d)) {
        let userResponses = {
          scriptType: 'survey',
          QuestionName: Name,
          val: [saveDateFormat(d)],
          StationName,
          QuestionGroupName,
        };
        dispatch(updateTextResponse(userResponses));
        dispatch(
          updateError({scriptType: 'survey', QuestionName: Name, error: ''}),
        );
      }
    } else {
      setError(valid);
    }
    setOpen(false);
  };

  // update error message
  useEffect(() => setError(errorMsg), [errorMsg]);

  return (
    <View style={style.wrapper}>
      <RequiredLabel
        Name={NAME}
        Required={Required}
        error={userDate === null ? 'false' : error}
      />
      <Pressable onPress={() => setOpen(true)}>
        <Text style={style.textInputField}>
          {userDate ? userDate : 'MM/DD/YYYY'}
        </Text>
      </Pressable>
      <DatePicker
        modal={true}
        open={open}
        mode="date"
        date={userDate ? new Date(userDate) : new Date()}
        onConfirm={handleChange}
        onCancel={() => setOpen(false)}
      />
      <ErrorLabel msg={LANGUAGE[error] ? LANGUAGE[error] : error} />
    </View>
  );
};

export default DateField;
const style = StyleSheet.create({
  wrapper: {
    marginBottom: 15,
  },
  textInputField: {
    borderWidth: 0.5,
    borderRadius: 5,
    height: 35,
    fontSize: 17,
    padding: 5,
  },
});
