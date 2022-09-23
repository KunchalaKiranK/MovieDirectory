import React from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';

const OrderNotes = () => {
  return (
    <ScrollView style={styles.screenWrapper}>
      <Text>Instruction</Text>
    </ScrollView>
  );
};

export default OrderNotes;

const styles = StyleSheet.create({
  screenWrapper: {
    padding: 20,
    backgroundColor: '#fff',
  },
});
