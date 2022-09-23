import React, {useRef, useEffect, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import {handleValidate, objectCleanUp, TYPE} from 'safeguard-corescript-npm';

import {useAppDispatch, useAppSelector} from '../../_app';
import {getMultiSelectOptionsData} from './options';
import {
  updateBottomSheetStatus,
  updateError,
  updateImagesInScript,
  updateTextResponse,
} from '../../_feature';

interface OptionProps {
  value: string;
  label: string;
  Selected?: boolean;
  Media?: any;
  Terminal?: string;
}

const MultiSelectOption = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const dispatch = useAppDispatch();

  // get values
  const OPEN = useAppSelector(state => state.user.bottomSheetModal.multiSelect);
  const QUESTIONS = useAppSelector(state => state.script.survey.questions);
  const QUESTION_NAME = useAppSelector(state => state.user.currentQuestion);
  const QUESTION_CHANGE = useAppSelector(state => state.user.questionChange);

  // local state
  const [options, setOptions] = useState<OptionProps[]>([]);
  const [questionProp, setQuestionProp] = useState<TYPE.QuestionProps>();
  const [updatedOptions, setUpdatedOptions] = useState<OptionProps[]>([]);
  //   const [selectedOptions, setSelectedOptions] = useState<OptionProps[]>([]);

  useEffect(() => {
    if (QUESTION_NAME) {
      let multiSelectProps = getMultiSelectOptionsData(QUESTION_NAME);
      if (multiSelectProps) {
        let {option, questionProps} = multiSelectProps;
        setOptions(option);
        setUpdatedOptions(option);
        setQuestionProp(questionProps);
      }
    }
  }, [QUESTION_NAME, QUESTION_CHANGE]);

  // local state
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
  }, [searchText, options]);

  // render option
  const renderItem = (item: OptionProps) => (
    <Pressable
      key={item.value}
      style={styles.optionWrap}
      onPress={() => handleOptionSelect(item)}>
      <Text style={styles.optionText}>{item.label}</Text>
      <View style={styles.optionCheck(item.Selected)} />
    </Pressable>
  );

  // update value to store on select
  const handleMultiSelect = (e: any) => {
    let {QuestionGroup, StationName} = QUESTIONS[QUESTION_NAME];
    if (questionProp && StationName && QuestionGroup && QUESTION_NAME) {
      // handle the logic for media and terminal key include in response for reuse
      let values = e.map((item: any) => {
        if (item.Media && item.Terminal) {
          return [item.value, item.Media, item.Terminal];
        }
        if (item.Terminal) {
          return [item.value, item.Media, item.Terminal];
        }
        if (item.Media) {
          return [item.value, item.Media];
        }
        return [item.value];
      });

      let valid = handleValidate(questionProp, values);
      if (valid === 'true') {
        let userResponses = {
          scriptType: 'survey',
          QuestionName: QUESTION_NAME,
          val: values,
          StationName,
          QuestionGroupName: QuestionGroup,
        };
        // update values to redux
        dispatch(updateTextResponse(userResponses));
        dispatch(
          updateError({
            scriptType: 'survey',
            QuestionName: QUESTION_NAME,
            error: '',
          }),
        );

        let media = values.map((item: any) => {
          if (item[1] !== undefined) {
            return item[1];
          }
        });
        let photosMedia = media;
        let tempMediaData: {
          Photos: any[];
          Videos: any[];
          Documents: any[];
          ScreenShots: any[];
        } = {
          Photos: [],
          Videos: [],
          Documents: [],
          ScreenShots: [],
        };
        photosMedia.forEach((item: any) => {
          if (item && Object.keys(item)[0] === 'Photos') {
            tempMediaData.Photos.push(...item.Photos);
          }
          if (item && Object.keys(item)[0] === 'Videos') {
            tempMediaData.Videos.push(...item.Videos);
          }
          if (item && Object.keys(item)[0] === 'Documents') {
            tempMediaData.Documents.push(...item.Documents);
          }
          if (item && Object.keys(item)[0] === 'ScreenShots') {
            tempMediaData.ScreenShots.push(...item.ScreenShots);
          }
        });

        if (Object.keys(media).length > 0) {
          dispatch(
            updateImagesInScript({
              question: QUESTION_NAME,
              answer: true,
              media: objectCleanUp(tempMediaData),
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
    }
  };

  const handleSaveUserResponce = () => {
    // close the modal
    handleCloseSheet();

    // filter all selected options
    let selectedOptionList = options.filter(option => option.Selected);
    handleMultiSelect(selectedOptionList);
  };

  // handle option select
  const handleOptionSelect = (val: OptionProps) => {
    // filter all selected options
    let selectedOptionList = options.filter(option => option.Selected);

    // check if selected option contain terminal key
    if (val.Terminal === 'Y') {
      // initial condition
      if (selectedOptionList.length === 0) {
        let selectOption = options.map(item => {
          if (item.label === val.label) {
            return {...val, Selected: !val.Selected};
          }
          return item;
        });
        setOptions(() => selectOption);
        return undefined;
      }
      // if we have selected at least one option
      if (
        selectedOptionList.length === 1 &&
        selectedOptionList[0].Terminal === 'Y' &&
        selectedOptionList[0].Selected === true
      ) {
        let selected = options.map(option => {
          if (option.label === val.label) {
            return {...option, Selected: !val.Selected};
          } else {
            return {...option, Selected: false};
          }
        });
        setOptions(() => selected);
        return undefined;
      } else {
        let selected = options.map(option => {
          if (option.label === val.label) {
            return {...option, Selected: true};
          } else {
            return {...option, Selected: false};
          }
        });
        setOptions(() => selected);
        return undefined;
      }
    } else {
      // the selected option doesn't conatain terminal key
      if (
        selectedOptionList.length === 1 &&
        selectedOptionList[0].Terminal === 'Y' &&
        selectedOptionList[0].Selected === true
      ) {
        let selected = options.map(option => {
          if (option.label === val.label) {
            return {...option, Selected: !val.Selected};
          } else {
            return {...option, Selected: false};
          }
        });
        setOptions(() => selected);
        return undefined;
      }
      let selectOption = options.map(item => {
        if (item.label === val.label) {
          return {...val, Selected: !val.Selected};
        }
        return item;
      });
      setOptions(() => selectOption);
    }
  };

  // handle sheet close
  const handleCloseSheet = () => {
    dispatch(updateBottomSheetStatus({status: false, type: 'multiSelect'}));
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
      onClose={handleCloseSheet}
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
        <Pressable style={styles.applyBtn} onPress={handleSaveUserResponce}>
          <Text style={styles.applyText}>Apply</Text>
        </Pressable>
      </View>
    </BottomSheet>
  );
};

export default MultiSelectOption;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
    backgroundColor: '#0001',
  },

  textInputField: {
    width: '95%',
    borderWidth: 0.5,
    borderRadius: 5,
    height: 35,
    fontSize: 17,
    padding: 5,
    margin: 10,
  },
  optionWrap: {
    borderWidth: 0.5,
    borderRadius: 5,
    width: '95%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: '2.5%',
    paddingRight: 10,
    marginBottom: 5,
  },
  optionText: {
    fontSize: 16,
    padding: 5,
    margin: 5,
    color: '#000',
  },
  optionCheck: (val: boolean) => ({
    height: 20,
    width: 20,
    backgroundColor: val ? 'green' : 'white',
    borderRadius: 20,
  }),
  applyBtn: {
    backgroundColor: 'pink',
    height: 30,
    marginBottom: 20,
    width: '95%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  applyText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
