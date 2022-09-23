import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {getDateFromString} from 'safeguard-corescript-npm';

import {useAppSelector} from '../../_app';

const OrderDetails = () => {
  const LUGGAGE = useAppSelector(state => state.luggage.Luggages);
  const LANGUAGE = useAppSelector(state => state.lang.keyValues);
  let {WORKORDER, PROPERTY} = LUGGAGE;

  const getWorkOrderValue = (str: string) => {
    let temp = WORKORDER?.questions[str] ? WORKORDER?.questions[str] : null;
    let val = temp ? temp?.answers : null;
    return val ? (LANGUAGE[val[0]] ? LANGUAGE[val[0]] : val[0]) : '';
  };

  const getPropertyValue = (str: string) => {
    let temp = PROPERTY?.questions[str] ? PROPERTY?.questions[str] : null;
    let val = temp ? temp?.answers : null;
    return val ? (LANGUAGE[val[0]] ? LANGUAGE[val[0]] : val[0]) : '';
  };

  return (
    <ScrollView style={styles.screenWrapper}>
      <View style={styles.row}>
        <Text>Address</Text>
        <Text style={styles.response}>
          {getPropertyValue('Property.TblAddress1')}
          {getPropertyValue('Property.TblCity')}
          {getPropertyValue('Property.TblState')}
          {getPropertyValue('Property.TblZip')}
        </Text>
      </View>
      <View style={styles.row}>
        <Text>Work Type</Text>
        <Text style={styles.response}>
          {getPropertyValue('Property.LoanType')}
        </Text>
      </View>
      <View style={styles.row}>
        <Text>Client</Text>
        <Text style={styles.response}>
          {getWorkOrderValue('WorkOrder.TblWorkCode')}
        </Text>
      </View>
      <View style={styles.row}>
        <Text>Due Date</Text>
        <Text style={styles.response}>
          {getDateFromString(getWorkOrderValue('WorkOrder.TblDueDt'))}
        </Text>
      </View>
      <View style={styles.row}>
        <Text>Lockbox Code</Text>
        <Text style={styles.response}>----</Text>
      </View>
      <View style={styles.row}>
        <Text>Name</Text>
        <Text style={styles.response}>
          {getWorkOrderValue('WorkOrder.TblVendorCode')}
        </Text>
      </View>
      <View style={styles.row}>
        <Text>Order Number</Text>
        <Text style={styles.response}>
          {getWorkOrderValue('WorkOrder.OrderNumber')}
        </Text>
      </View>
      <View style={styles.row}>
        <Text>Order Date</Text>
        <Text style={styles.response}>
          {getDateFromString(getWorkOrderValue('WorkOrder.OrderDate'))}
        </Text>
      </View>
      <View style={styles.row}>
        <Text>Occupancy Status</Text>
        <Text style={styles.response}>
          {getPropertyValue('Property.TblOccupied')}
        </Text>
      </View>
      <View style={styles.row}>
        <Text>Appointment</Text>
        <Text style={styles.response}> ----</Text>
      </View>
      <View style={styles.row}>
        <Text>Complete Date</Text>
        <Text style={styles.response}>
          {getWorkOrderValue('WorkOrder.CompletedDate')}
        </Text>
      </View>
      <View style={styles.row}>
        <Text>Loan Type</Text>
        <Text style={styles.response}>
          {getPropertyValue('Property.LoanType')}
        </Text>
      </View>
      <View style={styles.row}>
        <Text>Work Ordered</Text>
        <Text style={styles.response}>----</Text>
      </View>
      <View style={styles.row}>
        <Text>Order Assignment</Text>
        <Text style={styles.response}> ----</Text>
      </View>
    </ScrollView>
  );
};

export default OrderDetails;

const styles = StyleSheet.create({
  screenWrapper: {
    backgroundColor: '#fff',
    paddingLeft: 10,
    paddingRight: 10,
  },
  row: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 10,
  },
  response: {
    width: '50%',
    textAlign: 'right',
  },
});
