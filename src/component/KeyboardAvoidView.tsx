import React from 'react';
import {KeyboardAvoidingView, Platform, StyleSheet} from 'react-native';

const KeyboardAvoidView = ({children}: {children: React.ReactNode}) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      {children}
    </KeyboardAvoidingView>
  );
};

export default KeyboardAvoidView;

const styles = StyleSheet.create({
  container: {flex: 1},
});
