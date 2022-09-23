import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {
  getDefaultValueSelect,
  getPrePopulatedValue,
  TYPE,
} from 'safeguard-corescript-npm';

import {useAppDispatch, useAppSelector} from '../../_app';
import RequiredLabel from './RequiredLabel';
import ErrorLabel from './ErrorLabel';
import {updateBottomSheetStatus, updateCurrentQuestions} from '../../_feature';
import {TextInput} from 'react-native-gesture-handler';

// option TYPE
interface OptionProps {
  value: string;
  label: string;
  Media?: any;
}

const MultiSelectField = (props: TYPE.QuestionProps) => {
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
    // handle if user alrady had answer
    if (userResponse) {
      return userResponse.map((item: string) => ({
        value: item[0],
        label: LANGUAGE[item[0]] ? LANGUAGE[item[0]] : item[0],
        Media: item[1],
        Terminal: item[2],
      }));
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
      );
      if (value[0] === 'DEFAULT') {
        return [];
      }
      return value.map(item => ({
        value: item,
        label: LANGUAGE[item] ? LANGUAGE[item] : item,
        Terminal: item,
        Media: undefined,
      }));
    }
    // handle default select
    if (Answers) {
      return getDefaultValueSelect(Answers).map(item => ({
        value: item,
        label: LANGUAGE[item] ? LANGUAGE[item] : item,
        Terminal: '',
        Media: undefined,
      }));
    }
    // else return empty select
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
        type: 'multiSelect',
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
        <TextInput
          pointerEvents="none"
          style={style.textInputField(defaultValue.length > 0)}
          multiline
          defaultValue={
            defaultValue.length > 0
              ? defaultValue.map(i => i.label).join(', ')
              : 'Select values'
          }
        />
      </Pressable>
      <ErrorLabel msg={LANGUAGE[error] ? LANGUAGE[error] : error} />
    </View>
  );
};

export default MultiSelectField;

const style = StyleSheet.create({
  wrapper: {
    marginBottom: 15,
  },
  textInputField: (val: boolean) => ({
    borderWidth: 0.5,
    borderRadius: 5,
    minHeight: 35,
    fontSize: 17,
    padding: 5,
    color: val ? 'black' : 'grey',
  }),
});
