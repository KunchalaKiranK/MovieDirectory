import React from 'react';
import {StyleSheet, Text} from 'react-native';

interface ErrorLabelProp {
  msg: string;
}

const ErrorLabel = (props: ErrorLabelProp) => {
  if (props.msg) {
    return <Text style={styles.errorMessage}>{props.msg}</Text>;
  } else {
    return null;
  }
};

export default ErrorLabel;

const styles = StyleSheet.create({
  errorMessage: {
    fontSize: 14,
    color: '#f00',
  },
});
