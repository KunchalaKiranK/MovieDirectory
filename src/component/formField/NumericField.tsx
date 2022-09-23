import React, {useState} from 'react';
import {TextInput, StyleSheet, View} from 'react-native';
import {
  getPrePopulatedValue,
  handleValidate,
  TYPE,
} from 'safeguard-corescript-npm';

import {useAppDispatch, useAppSelector} from '../../_app';
import {updateError, updateTextResponse} from '../../_feature';
import ErrorLabel from './ErrorLabel';
import RequiredLabel from './RequiredLabel';

const NumericField = (props: TYPE.QuestionProps) => {
  let {
    Name,
    Required,
    PrePopulate,
    QuestionGroupName,
    StationName,
    userResponse,
  } = props;

  const dispatch = useAppDispatch();

  const LUGGAGE = useAppSelector(state => state.luggage);
  const LANGUAGE = useAppSelector(state => state.lang.keyValues);
  const errorMsg = useAppSelector(
    state => state.script.survey.questions[Name].error,
  );

  const NAME = LANGUAGE[Name] ? LANGUAGE[Name] : Name;

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
          ? ''
          : userResponse[0]
        : value;
    }
    return userResponse === null ? '' : userResponse[0];
  };

  const [userText, setUserText] = useState<string>(() => initialValue());
  const [error, setError] = useState<string>(errorMsg);

  // update value to store on focus change
  const handleFoucuseOut = () => {
    let valid = handleValidate(props, [userText]);
    if (valid === 'true' || (userText === '' && props.Required === 'N')) {
      setError('');
      if ((userResponse ? userResponse[0] : '') !== userText) {
        let userResponses = {
          scriptType: 'survey',
          QuestionName: Name,
          val: [userText],
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
  };

  const handleNumberUpdate = (event: string) => {
    let exp = new RegExp(/^\d*\.?\d*$/);
    if (exp.test(event)) {
      setUserText(event);
    }
  };

  return (
    <View style={style.wrapper}>
      <RequiredLabel
        Name={NAME}
        Required={Required}
        error={userText === '' ? 'false' : error}
      />
      <TextInput
        style={style.textInputField}
        value={userText}
        onChangeText={handleNumberUpdate}
        onBlur={handleFoucuseOut}
        returnKeyType="done"
        keyboardType="decimal-pad"
      />
      <ErrorLabel msg={LANGUAGE[error] ? LANGUAGE[error] : error} />
    </View>
  );
};

export default NumericField;

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
