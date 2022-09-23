import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

interface RequiredLabel {
  Name: string;
  error: string;
  Required: string | undefined;
}

const RequiredLabel = (props: RequiredLabel) => {
  const [errors, setErrors] = useState<boolean>(true);
  useEffect(() => {
    if (props.error === '') {
      setErrors(false);
    } else {
      setErrors(true);
    }
  }, [props.error]);
  return (
    <View style={styles.mandatoryTextView}>
      <Text style={styles.quesLabelText}>{props.Name}</Text>
      {props.Required ? (
        props.Required === 'Y' ? (
          <Text style={styles.mandatoryTextField(errors)}>Required</Text>
        ) : null
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  mandatoryTextField: (val: boolean) => ({
    color: val ? '#f00' : '#0f0',
    borderWidth: 0.5,
    borderColor: val ? '#f00' : '#0f0',
    padding: 2,
    fontSize: 12,
    borderRadius: 3,
    alignItems: 'flex-start',
  }),
  quesLabelText: {
    fontSize: 16,
    color: 'grey',
    flex: 1,
    alignItems: 'flex-start',
  },
  mandatoryTextView: {
    marginBottom: 5,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
});

export default RequiredLabel;
