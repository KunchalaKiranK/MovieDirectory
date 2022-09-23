import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useAppSelector} from '../../_app';

const OrderInstruction = () => {
  const LUGGAGE = useAppSelector(state => state.luggage.Luggages);
  const LANGUAGE = useAppSelector(state => state.lang.keyValues);
  let {WORKORDER} = LUGGAGE;

  const getWorkOrderValue = (str: string) => {
    let temp = WORKORDER?.questions[str] ? WORKORDER?.questions[str] : null;
    let val = temp ? temp?.answers : null;
    return val ? (LANGUAGE[val[0]] ? LANGUAGE[val[0]] : val[0]) : '';
  };

  const SPECIAL_INSTRUCTION = getWorkOrderValue(
    'WorkOrder.SpecialInstructions',
  );
  let INSTRUCTION = getWorkOrderValue('WorkOrder.Instructions');

  return (
    <ScrollView style={styles.screenWrapper}>
      <View>
        <Text style={styles.mainTitle}>Special Instructions</Text>
        <View style={styles.info}>
          <Text>{SPECIAL_INSTRUCTION}</Text>
        </View>
      </View>
      <View>
        <Text style={styles.mainTitle}>Instructions</Text>
        <View style={styles.info}>
          <Text>{INSTRUCTION}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default OrderInstruction;

const styles = StyleSheet.create({
  screenWrapper: {
    padding: 20,
    backgroundColor: '#fff',
  },
  mainTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  info: {
    backgroundColor: '#00f2',
    padding: 10,
    borderRadius: 10,
  },
});
