import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {OrderGridView} from '../component';
import {returnFilteredList, returnSortedList} from '../utils/reUsables';
import {useAppSelector} from '../_app';
import {OrderListProp} from '../_feature/orderLists';
import {_pullDownToDownloadOrder} from '../_service';

const OrderGrid = (props: any) => {
  const {
    searchText,
    sortCategory,
    setSortCategory,
    sortOrder,
    setSortOrder,
    appliedFilters,
    setOrderCount,
  } = props;
  const ORDER_LIST = useAppSelector(state => state.orderList.orderList);

  let ORDERS = useAppSelector(state => state.orderList.downloadedOrderList);

  const returnOrderList = () => (ORDER_LIST ? ORDER_LIST : []);

  const [orderList, setOrderList] = useState(() => returnOrderList());
  const [refresh, setRefresh] = useState(false);

  const isFocused = useIsFocused();

  const pullToRefresh = () => {
    console.log('refresing');
    setRefresh(true);
    _pullDownToDownloadOrder();
    setTimeout(() => {
      setRefresh(false);
    }, 5000);
  };

  useEffect(() => {
    let orders = ORDERS ? ORDERS : [];
    let availableOrder = ORDER_LIST.filter((item: OrderListProp) =>
      orders.some(order => order === item.orderNumber),
    );
    setOrderList(() => availableOrder);
    setOrderCount(availableOrder.length);
  }, [ORDER_LIST, ORDERS]);

  useEffect(() => {
    if (!isFocused) return;
    if (!sortCategory.value) return;

    const tempArr = returnSortedList(orderList, sortCategory.value, sortOrder);

    setOrderList(tempArr);
  }, [sortCategory, sortOrder]);

  useEffect(() => {
    if (!isFocused) return;
    if (searchText.prevLen === 0 && searchText.currLen === 0 && !appliedFilters)
      return;

    if (searchText.currLen > searchText.prevLen) {
      const tempList = returnFilteredList(
        orderList,
        appliedFilters,
        searchText.data,
      );
      setOrderList(tempList);
      setOrderCount(tempList.length);
    } else {
      const tempList = returnFilteredList(
        returnOrderList(),
        appliedFilters,
        searchText.data,
      );
      setOrderList(tempList);
      setOrderCount(tempList.length);
    }
  }, [searchText, appliedFilters]);

  return (
    <SafeAreaView style={styles.container}>
      {orderList ? (
        <>
          <View style={styles.table}>
            <View style={styles.table_heading}>
              <View style={{flex: 1}}>
                <Pressable
                  onPress={() => {
                    if (sortCategory.value !== 'orderNumber') {
                      setSortCategory({value: 'orderNumber'});
                    } else {
                      setSortOrder((prev: number) => prev * -1);
                    }
                  }}>
                  <Text style={styles.text}>WO Number</Text>
                </Pressable>
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.text}>Assignment</Text>
              </View>
              <View style={{flex: 0.7}}>
                <Pressable
                  onPress={() => {
                    if (sortCategory.value !== 'loanType') {
                      setSortCategory({value: 'loanType'});
                    } else {
                      setSortOrder((prev: number) => prev * -1);
                    }
                  }}>
                  <Text style={styles.text}>Type</Text>
                </Pressable>
              </View>
              <View style={{flex: 0.3}}>
                <Pressable style={styles.customize}>
                  <Text style={styles.text}>X</Text>
                </Pressable>
              </View>
            </View>
            <FlatList
              data={orderList}
              renderItem={({item}: {item: OrderListProp}) => (
                <OrderGridView {...item} />
              )}
              keyExtractor={(item: OrderListProp) => item.orderNumber}
              refreshControl={
                <RefreshControl
                  refreshing={refresh}
                  onRefresh={pullToRefresh}
                />
              }
            />
            {/* <CustomizeList /> */}
          </View>
        </>
      ) : (
        <View>
          <Text>hello</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default OrderGrid;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  table: {
    borderWidth: 1,
    borderColor: '#D6D6D7',
    margin: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  table_heading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderBottomWidth: 1,
    borderBottomColor: '#D6D6D7',
  },
  customize: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#585859',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    color: 'black',
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
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
});
