import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';

import {NoOrderView, OrderListView} from '../component';
import {returnFilteredList, returnSortedList} from '../utils/reUsables';
import {useAppSelector} from '../_app';
import {FilterListProp} from '../_feature/filtertList';
import {OrderListProp} from '../_feature/orderLists';
import {_pullDownToDownloadOrder} from '../_service';

export interface FilterValues {
  label: string;
  value: string;
}

export interface AppliedFilters {
  clients?: FilterValues[];
  types?: FilterValues[];
  statuses?: FilterValues[];
  dueDates?: any;
  progressStatuses?: FilterValues[];
  cities?: FilterValues[];
  states?: FilterValues[];
  assignments?: FilterValues[];
  tags?: FilterValues[];
}

interface IProps {
  searchText: {
    prevLen: number;
    currLen: number;
    data: string;
  };
  sortCategory: string;
  sortOrder: number;
  appliedFilters: AppliedFilters;
  setOrderCount: (p: number) => void;
}

const OrderList = (props: IProps) => {
  const {searchText, sortCategory, sortOrder, appliedFilters, setOrderCount} =
    props;
  const ORDER_LIST = useAppSelector<FilterListProp[]>(
    state => state.orderList.orderList,
  );

  let ORDERS = useAppSelector(state => state.orderList.downloadedOrderList);
  const {user} = useAppSelector(state => state.user);

  const returnOrderList = () =>
    ORDER_LIST
      ? ORDER_LIST.filter(item =>
          ORDERS.some(order => order === item.orderNumber),
        )
      : [];

  const [orderList, setOrderList] = useState(() => returnOrderList());
  const [refresh, setRefresh] = useState(false);
  const isFocused = useIsFocused();

  const pullToRefresh = () => {
    console.log('refresing');
    setRefresh(true);
    _pullDownToDownloadOrder();
  };
  useEffect(() => {
    if (orderList.length > 0) {
      setRefresh(false);
    }
  }, [orderList]);

  useEffect(() => {
    let orders = ORDERS ? ORDERS : [];
    let availableOrder = ORDER_LIST.filter(item =>
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
      setOrderCount(tempList.length);
      setOrderList(tempList);
    } else {
      const tempList = returnFilteredList(
        returnOrderList(),
        appliedFilters,
        searchText.data,
      );
      setOrderCount(tempList.length);
      setOrderList(tempList);
    }
  }, [searchText, appliedFilters]);

  return (
    <SafeAreaView style={styles.container}>
      {orderList && (
        <FlatList
          data={orderList}
          renderItem={({item}: {item: OrderListProp}) => (
            <OrderListView {...item} user={user} />
          )}
          keyExtractor={(item: OrderListProp) => item.orderNumber}
          refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={pullToRefresh} />
          }
        />
      )}
      {orderList.length === 0 && (
        <View style={{margin: 20}}>
          <NoOrderView />
        </View>
      )}
    </SafeAreaView>
  );
};

export default OrderList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  total_orders: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    paddingBottom: 0,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 20,
    color: 'black',
  },
  subtitle: {
    fontSize: 16,
    color: 'black',
  },
  address: {
    fontSize: 15,
    width: '70%',
    flexWrap: 'wrap',
  },
  itemContainer: {
    backgroundColor: 'white',
  },
  itemView: {
    flexDirection: 'row',
  },
  orderImage: {
    width: 100,
    height: 100,
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
});
