import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {
  getDefaultValue,
  getPrePopulatedValue,
  TYPE,
} from 'safeguard-corescript-npm';

import {useAppDispatch, useAppSelector} from '../../_app';
import RequiredLabel from './RequiredLabel';
import ErrorLabel from './ErrorLabel';
import {updateBottomSheetStatus, updateCurrentQuestions} from '../../_feature';

// option TYPE
interface OptionProps {
  value: string;
  label: string;
  Media?: any;
}

const SingleSelectField = (props: TYPE.QuestionProps) => {
  const {Name, Answers, userResponse, Required, PrePopulate} = props;
  const dispatch = useAppDispatch();

  // get the Language form store
  const Question = useAppSelector(state => state.script.survey.questions);
  const LANGUAGE = useAppSelector(state => state.lang.keyValues);
  const LUGGAGE = useAppSelector(state => state.luggage);
  const errorMsg = useAppSelector(
    state => state.script.survey.questions[Name].error,
  );

  // map the key with language pack
  let NAME = LANGUAGE[Name] ? LANGUAGE[Name] : Name;

  // function for get prePopulate value
  const getPreValue = () => {
    // handle if user already had answer
    if (userResponse) {
      return [
        {
          value: userResponse[0],
          label: LANGUAGE[userResponse[0]]
            ? LANGUAGE[userResponse[0]]
            : userResponse[0],
          Media: userResponse[1],
        },
      ];
    }
    // handle prePopulated key
    if (
      PrePopulate &&
      PrePopulate.PrePopulatedBy.Type === 'Luggage' &&
      PrePopulate.PrePopulatedBy.LuggageSource
    ) {
      let value = getPrePopulatedValue(
        LUGGAGE,
        PrePopulate.PrePopulatedBy.Key,
        PrePopulate.PrePopulatedBy.LuggageSource,
      )[0];
      if (value === 'DEFAULT') {
        return [];
      }
      return [
        {
          value: value,
          label: LANGUAGE[value] ? LANGUAGE[value] : value,
          Media: undefined,
        },
      ];
    }
    // handle default select
    if (Answers && getDefaultValue(Answers) !== 'DEFAULT') {
      let value = getDefaultValue(Answers);
      return [
        {
          value: value,
          label: LANGUAGE[value] ? LANGUAGE[value] : value,
          Media: undefined,
        },
      ];
    }

    // else
    return [];
  };

  // component states
  const [defaultValue, setDefaultValue] = useState<OptionProps[]>(() =>
    getPreValue(),
  );
  const [error, setError] = useState<string>(errorMsg);

  // update user response
  useEffect(() => {
    setDefaultValue(getPreValue());
  }, [Question]);

  // update error message
  useEffect(() => setError(errorMsg), [errorMsg]);

  // invoke the bottom sheet
  const handleSingleSelectBottomSheet = () => {
    dispatch(updateCurrentQuestions(Name));
    dispatch(
      updateBottomSheetStatus({
        status: true,
        type: 'singleSelect',
      }),
    );
  };

  return (
    <View style={style.wrapper}>
      <RequiredLabel
        Name={NAME}
        Required={Required}
        error={defaultValue.length === 0 ? 'false' : error}
      />
      <Pressable onPress={handleSingleSelectBottomSheet}>
        <Text style={style.textInputField(defaultValue[0])}>
          {defaultValue[0] ? defaultValue[0].label : 'Select a value'}
        </Text>
      </Pressable>
      <ErrorLabel msg={LANGUAGE[error] ? LANGUAGE[error] : error} />
    </View>
  );
};

export default SingleSelectField;

const style = StyleSheet.create({
  wrapper: {
    marginBottom: 15,
  },
  textInputField: (val: boolean) => ({
    borderWidth: 0.5,
    borderRadius: 5,
    height: 35,
    fontSize: 17,
    padding: 5,
    color: val ? 'black' : 'grey',
  }),
});
