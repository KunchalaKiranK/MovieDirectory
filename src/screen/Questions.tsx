import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {renderQuestionGroups, TYPE} from 'safeguard-corescript-npm';
import {
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import {useAppDispatch, useAppSelector} from '../_app';
import {QUESTION_TYPE, renderQuestions} from '../config';
import {KeyboardAvoidView, QuestionGroupHOC} from '../component';
import Stations from '../component/bottomSheet/Stations';
import SingleSelectOption from '../component/bottomSheet/SingleSelectOption';
import MultiSelectOption from '../component/bottomSheet/MultiSelectOption';
import MediaLabelAtSurvey from '../component/bottomSheet/MediaLabelAtSurvey';
import {updateBottomSheetStatus, updateCurrentStation} from '../_feature';

const Questions = ({route}: {route: any}) => {
  let {station} = route.params;
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const MediaAtSurveyStatus = useAppSelector(
    state => state.user.bottomSheetModal.mediaAtSurvey,
  );

  // get the data from store
  const STATIONS_DATA = useAppSelector(
    state => state.script.survey.stationData,
  );

  if (station === 'initial') {
    station = STATIONS_DATA[0]?.Name;
  }
  const LANGPACK = useAppSelector(state => state.lang.keyValues);

  const getName = (key: string) => {
    return LANGPACK[key] ? LANGPACK[key] : key;
  };

  const handleNavigateToScreen = (screen: string) => {
    console.log('navigate to screen ', screen);
    navigation.navigate(screen, {station});
  };

  // invoke the bottom sheet
  const hadleOpenMediaAtSurvey = () => {
    dispatch(updateCurrentStation(station));
    dispatch(
      updateBottomSheetStatus({
        status: !MediaAtSurveyStatus,
        type: 'mediaAtSurvey',
      }),
    );
  };

  if (!station) return <Text>Loading</Text>;
  if (!STATIONS_DATA[station]) return <Text>Page not found</Text>;
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidView>
        <ScrollView style={styles.scrollViewStyle}>
          <View style={styles.questionView}>
            <Text style={styles.titleText}>{getName(station)}</Text>
            {STATIONS_DATA[station].QuestionGroups?.map(
              (questionGroup: TYPE.QuestionGroupProps) => {
                return renderQuestionGroups(questionGroup) ||
                  questionGroup.ActivatedBy ? (
                  questionGroup.ActivatedBy ? (
                    <QuestionGroupHOC
                      key={questionGroup.Name}
                      {...questionGroup}
                    />
                  ) : null
                ) : (
                  <View style={{width: '100%'}} key={questionGroup.Name}>
                    {questionGroup.DisplayQuestionGroupName &&
                    questionGroup.DisplayQuestionGroupName === 'Y' ? (
                      <Text>{getName(questionGroup.Name)}</Text>
                    ) : null}
                    {questionGroup.Questions.map(
                      (question: TYPE.QuestionProps) => {
                        return QUESTION_TYPE.includes(question.Type) ? (
                          <View style={{width: '100%'}} key={question.Name}>
                            {renderQuestions(question)}
                          </View>
                        ) : null;
                      },
                    )}
                  </View>
                );
              },
            )}
          </View>
        </ScrollView>
        {/* <MediaLabelAtSurvey /> */}
        <View style={styles.footer}>
          {/* <Pressable
            style={[
              styles.modelBtn(MediaAtSurveyStatus),
              {
                transform: MediaAtSurveyStatus ? [{rotateX: '180deg'}] : [],
              },
            ]}
            onPress={hadleOpenMediaAtSurvey}>
            <Text style={styles.modelText}>^</Text>
          </Pressable> */}
          <View style={styles.buttonWrapper}>
            <Pressable
              style={styles.button}
              onPress={() => handleNavigateToScreen('Camera')}>
              <Text>Camara</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => handleNavigateToScreen('Gallery')}>
              <Text>Gallery</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => handleNavigateToScreen('Label')}>
              <Text>Label</Text>
            </Pressable>
          </View>
        </View>
        <SingleSelectOption />
        <MultiSelectOption />
        <Stations />
      </KeyboardAvoidView>
    </TouchableWithoutFeedback>
  );
};

export default Questions;

const styles = StyleSheet.create({
  titleText: {padding: 10, fontSize: 18, color: '#000', marginTop: 10},
  scrollViewStyle: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#fff9',
  },
  questionView: {
    paddingRight: 0,
    paddingLeft: 0,
    paddingBottom: 20,
  },
  footer: {
    marginBottom: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  modelBtn: (val: boolean) => ({
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: 'lightgrey',
    position: 'absolute',
    bottom: val ? 145 : 30,
    height: 25,
    width: 30,
  }),
  modelText: {
    fontSize: 30,
    textAlign: 'center',
  },
  buttonWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    padding: 5,
    borderRadius: 50,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00f1',
    margin: 5,
  },
});
