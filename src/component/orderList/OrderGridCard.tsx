import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {ORDER_STATUS} from '../../utils';
import { useAppSelector } from '../../_app';

import {OrderListProp} from '../../_feature/orderLists';

const OrderGridCard = (props: OrderListProp) => {
  let {
    city,
    clientId,
    orderNumber,
    postalCode,
    state,
    street1,
    status,
    dueDate,
    loanType,
  } = props;

  const [collapse, setCollapse] = useState(true);
  const {user} = useAppSelector(state => state.user);

  return (
    <View style={styles.itemContainer}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 7,
        }}>
        <View style={{flex: 1}}>
          <Text style={styles.text_black}>{orderNumber}</Text>
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.text_black}>{user}</Text>
        </View>
        <View style={{flex: 0.7}}>
          <Text style={styles.text_black}>{loanType.split('_')[1]}</Text>
        </View>
        <Pressable
          onPress={() => setCollapse(!collapse)}
          style={styles.collapse}>
          <Text style={{color: 'black'}}>^</Text>
        </Pressable>
      </View>

      {!collapse && (
        <>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 7,
            }}>
            <View style={{flex: 1}}>
              <Text style={styles.text_gray}>Window Start</Text>
              <Text style={styles.text_black}>07/18/22</Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.text_gray}>Due Date</Text>
              <Text style={styles.text_black}>{dueDate.substring(0, 10)}</Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.text_gray}>Code</Text>
              <Text style={styles.text_black}>{loanType.split('_')[1]}</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 7,
            }}>
            <View style={{flex: 1}}>
              <Text style={styles.text_gray}>Order Date</Text>
              <Text style={styles.text_black}>{dueDate.substring(0, 10)}</Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.text_gray}>Client</Text>
              <Text style={styles.text_black}>{clientId}</Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.text_gray}>City</Text>
              <Text style={styles.text_black}>{city}</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 7,
            }}>
            <View style={{flex: 1}}>
              <Text style={styles.text_gray}>Address</Text>
              <Text style={styles.text_black}>{street1}</Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.text_gray}>State</Text>
              <Text style={styles.text_black}>{state}</Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.text_gray}>Zip</Text>
              <Text style={styles.text_black}>{postalCode}</Text>
            </View>
          </View>
          <View style={{padding: 7}}>
            <Text style={styles.text_gray}>Status</Text>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  color: ORDER_STATUS[status].color,
                  borderColor: ORDER_STATUS[status].color,
                  borderWidth: 1,
                }}>
                {ORDER_STATUS[status].key}
              </Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default OrderGridCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  header: {
    backgroundColor: '#F5F5F5',
    padding: 7,
  },
  title: {
    fontSize: 14,
    color: 'black',
  },
  subtitle: {
    fontSize: 16,
    color: 'black',
  },
  address: {
    color: 'black',
    fontSize: 12,
    width: '70%',
    flexWrap: 'wrap',
  },
  itemContainer: {
    backgroundColor: 'white',
    borderBottomColor: '#D6D6D7',
    borderBottomWidth: 1,
  },
  itemView: {
    flexDirection: 'row',
  },
  orderImage: {
    width: 70,
    height: 70,
    margin: 10,
    borderColor: 'black',
    borderWidth: 1,
  },
  orderContent: {
    justifyContent: 'center',
  },
  sepratorLine: {
    height: 1,
    width: '100%',
    backgroundColor: 'black',
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.3)',
  },
  search_input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#000',
    color: '#000',
    padding: 10,
    margin: 10,
    width: '80%',
  },
  collapse: {
    backgroundColor: '#F5F5F5',
    height: 20,
    width: 20,
    borderRadius: 2,
    flex: 0.3,
  },
  text_gray: {
    color: '#585859',
  },
  text_black: {
    color: '#2C2C2C',
  },
});
