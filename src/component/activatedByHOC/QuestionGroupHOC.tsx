import React, {useEffect, useState} from 'react';
import {TYPE} from 'safeguard-corescript-npm';
import {StyleSheet, Text, View} from 'react-native';

import {useAppSelector} from '../../_app';
import {QUESTION_TYPE, renderQuestions} from '../../config';
import {activatedByCheck} from '../../utils';

const QuestionGroupHOC = (props: TYPE.QuestionGroupProps) => {
  const {ActivatedBy, Name, Questions, DisplayQuestionGroupName} = props;

  // get data from store
  const currentOrder = useAppSelector(state => state.user.orderNumber);
  const LANGPACK = useAppSelector(state => state.lang.keyValues);
  const Question = useAppSelector(state => state.script.survey.questions);

  let NAME = LANGPACK[Name] ? LANGPACK[Name] : Name;

  const [activate, setActivate] = useState<boolean>(false);

  useEffect(() => {
    if (ActivatedBy) {
      let val = activatedByCheck(ActivatedBy, currentOrder, 'survey');
      if (activate !== val) {
        setActivate(val);
      }
    }
  }, [Question]);

  // question group components
  const QuestionGroup = (prop: TYPE.QuestionProps) => {
    const {Type} = prop;
    return QUESTION_TYPE.includes(Type) ? renderQuestions(prop) : null;
  };

  return ActivatedBy && activate ? (
    <View style={styles.wrapper} key={NAME}>
      {DisplayQuestionGroupName && DisplayQuestionGroupName === 'Y' ? (
        <Text> {NAME}</Text>
      ) : null}
      {Questions.map((question: TYPE.QuestionProps) => {
        return <QuestionGroup key={question.Name} {...question} />;
      })}
    </View>
  ) : null;
};

export default QuestionGroupHOC;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
