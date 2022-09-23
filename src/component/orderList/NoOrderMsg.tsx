import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const NoOrderMsg = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>No Order Assigned</Text>
      <Text style={styles.text}>
        When orders have been assigned to you, they will appear hear. Pull down
        on this view to check for new orders.
      </Text>
    </View>
  );
};

export default NoOrderMsg;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
});
