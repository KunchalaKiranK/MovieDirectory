import React, {useRef, useEffect, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import {handleValidate, TYPE} from 'safeguard-corescript-npm';

import {useAppDispatch, useAppSelector} from '../../_app';
import {getSingleSelectOptionsData} from './options';
import {
  updateBottomSheetStatus,
  updateError,
  updateImagesInScript,
  updateTextResponse,
} from '../../_feature';

interface OptionProps {
  value: string;
  label: string;
  Media?: any;
}

const SingleSelectOption = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const dispatch = useAppDispatch();

  // get values
  const OPEN = useAppSelector(
    state => state.user.bottomSheetModal.singleSelect,
  );
  const QUESTIONS = useAppSelector(state => state.script.survey.questions);
  const QUESTION_NAME = useAppSelector(state => state.user.currentQuestion);
  const QUESTION_CHANGE = useAppSelector(state => state.user.questionChange);

  const [options, setOptions] = useState<OptionProps[]>([]);
  const [questionProp, setQuestionProp] = useState<TYPE.QuestionProps>();
  const [updatedOptions, setUpdatedOptions] = useState<OptionProps[]>([]);

  useEffect(() => {
    if (QUESTION_NAME) {
      let singleSelectProps = getSingleSelectOptionsData(QUESTION_NAME);
      if (singleSelectProps) {
        let {option, questionProps} = singleSelectProps;
        setOptions(option);
        setUpdatedOptions(option);
        setQuestionProp(questionProps);
      }
    }
  }, [QUESTION_NAME, QUESTION_CHANGE]);

  // variables
  const snapPoints = ['1%', '80%'];
  const [searchText, setSearchText] = useState('');

  // track sheet status
  useEffect(() => {
    if (OPEN) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.collapse();
    }
  }, [OPEN, QUESTION_CHANGE]);

  // update the option list on search
  useEffect(() => {
    if (searchText === '') {
      setUpdatedOptions(() => options);
    } else {
      let exp = new RegExp(searchText.toLowerCase(), 'gi');
      let filteredOptions = options.filter((item: OptionProps) =>
        exp.test(item.label.toLowerCase()),
      );
      setUpdatedOptions(() => filteredOptions);
    }
  }, [searchText]);

  // render option
  const renderItem = (item: OptionProps) => (
    <Pressable
      key={item.value}
      style={styles.optionWrap}
      onPress={() => handleOptionSelect(item)}>
      <Text style={styles.optionText}>{item.label}</Text>
    </Pressable>
  );

  // update value to store on select
  const handleSingleSelect = (e: OptionProps) => {
    let {QuestionGroup, StationName} = QUESTIONS[QUESTION_NAME];
    if (questionProp && StationName && QuestionGroup && QUESTION_NAME) {
      let valid = handleValidate(questionProp, [e.value]);
      if (valid === 'true') {
        let value = e.Media ? [e.value, e.Media] : [e.value];
        let userResponses = {
          scriptType: 'survey',
          QuestionName: QUESTION_NAME,
          val: value,
          StationName: StationName,
          QuestionGroupName: QuestionGroup,
        };
        dispatch(updateTextResponse(userResponses));
        dispatch(
          updateError({
            scriptType: 'survey',
            QuestionName: QUESTION_NAME,
            error: '',
          }),
        );

        if (e.Media) {
          dispatch(
            updateImagesInScript({
              question: QUESTION_NAME,
              answer: true,
              media: e.Media,
            }),
          );
        } else {
          dispatch(
            updateImagesInScript({
              question: QUESTION_NAME,
              answer: false,
              media: {Photos: []},
            }),
          );
        }
      }
    } else {
      console.log(
        'someting went wrong while updating the single select value to redux',
      );
    }
  };

  // handle option select
  const handleOptionSelect = (item: OptionProps) => {
    handleCloseSheet();
    handleSingleSelect(item);
  };

  // handle sheet close
  const handleCloseSheet = () => {
    dispatch(updateBottomSheetStatus({status: false, type: 'singleSelect'}));
  };

  if (QUESTION_NAME === '') {
    return null;
  }
  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      detached={true}
      onClose={() => handleCloseSheet()}
      enableContentPanningGesture={true}
      enableHandlePanningGesture={true}
      enableOverDrag={true}>
      <View style={styles.contentContainer}>
        <BottomSheetTextInput
          style={styles.textInputField}
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search"
        />
        <BottomSheetScrollView>
          {updatedOptions.length > 0 && updatedOptions.map(renderItem)}
        </BottomSheetScrollView>
      </View>
    </BottomSheet>
  );
};

export default SingleSelectOption;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    minHeight: 200,
    backgroundColor: '#0001',
  },

  textInputField: {
    width: '100%',
    borderWidth: 0.5,
    borderRadius: 5,
    height: 35,
    fontSize: 17,
    padding: 5,
    marginBottom: 10,
  },
  optionWrap: {
    borderWidth: 0.5,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 10,
    paddingLeft: 10,
  },
  optionText: {
    fontSize: 16,
    padding: 5,
    margin: 5,
    color: '#000',
  },
});
