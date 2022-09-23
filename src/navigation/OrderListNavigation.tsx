import React, {useState} from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {debounce} from 'lodash';

import {OrderGridScreen, OrderListScreen} from '../screen';
import {OrderMapView} from '../component';
import {useDispatch} from 'react-redux';
import SortCategory from '../component/bottomSheet/SortCategory';
import {useNavigation} from '@react-navigation/native';

const TopTab = createMaterialTopTabNavigator();

interface IProps {
  searchText: SearchText;
  sortCategory: ISort;
  setSortCategory: (p: {label?: string; value: string}) => void;
  sortOrder: number;
  setSortOrder: (p: number) => void;
  appliedFilters: any;
  setOrderCount: (p: number) => void;
}
interface ISort {
  label?: string;
  value: string;
}
interface SearchText {
  data: string;
  prevLen: number;
  currLen: number;
}

const Navigate = ({
  sortCategory,
  setSortCategory,
  searchText,
  sortOrder,
  setSortOrder,
  appliedFilters,
  setOrderCount,
}: IProps) => (
  <TopTab.Navigator>
    <TopTab.Screen
      name="ListView"
      children={() => (
        <OrderListScreen
          searchText={searchText}
          sortCategory={sortCategory}
          sortOrder={sortOrder}
          appliedFilters={appliedFilters}
          setOrderCount={setOrderCount}
        />
      )}
    />
    <TopTab.Screen
      name="GridView"
      children={() => (
        <OrderGridScreen
          searchText={searchText}
          sortCategory={sortCategory}
          setSortCategory={setSortCategory}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          appliedFilters={appliedFilters}
          setOrderCount={setOrderCount}
        />
      )}
    />
    <TopTab.Screen name="MapView" component={OrderMapView} />
  </TopTab.Navigator>
);

const OrderListTab = props => {
  const [searchText, setSearchText] = useState<SearchText>({
    data: '',
    prevLen: 0,
    currLen: 0,
  });
  const [sortCategory, setSortCategory] = useState<any>({
    label: 'Select',
    value: '',
  });
  const [appliedFilters, setAppliedFilters] = useState({});
  const [showSortOptions, setShowSortOptions] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<number>(1);
  const [orderCount, setOrderCount] = useState<number>(0);
  const dispatch = useDispatch();
  const navigtion = useNavigation();

  // const handleShowSortOptions
  const delayedHandleChange = debounce(
    (data: any) =>
      setSearchText({
        data,
        prevLen: searchText.currLen,
        currLen: data.length,
      }),
    300,
  );

  return (
    <View style={{flex: 1}}>
      <View style={styles.headerBar}>
        <Text style={styles.title}>Orders {orderCount}</Text>
      </View>
      <View style={styles.search_sort_filter}>
        <View style={styles.search_sort_container}>
          <TextInput
            onChangeText={value => {
              delayedHandleChange(value);
            }}
            style={styles.search_input}
            defaultValue={searchText}
            returnKeyType="search"
            autoFocus={false}
            clearButtonMode="always"
            placeholder="Search here"
          />
          <Pressable
            style={styles.filter_icon}
            onPress={() =>
              navigtion.navigate('FilterOptions', {
                appliedFilters: appliedFilters,
                setAppliedFilters: setAppliedFilters,
              })
            }>
            <Image
              style={styles.sort_image}
              source={require('../assets/images/filter.png')}
            />
          </Pressable>
        </View>
        <Pressable
          style={styles.sort_icon}
          onPress={() => setShowSortOptions(true)}>
          <Image
            style={styles.sort_image}
            source={require('../assets/images/sort.png')}
          />
        </Pressable>
      </View>
      <Navigate
        sortCategory={sortCategory}
        setSortCategory={setSortCategory}
        searchText={searchText}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        appliedFilters={appliedFilters}
        setOrderCount={setOrderCount}
      />
      {showSortOptions && (
        <SortCategory
          showSortOptions={showSortOptions}
          setShowSortOptions={setShowSortOptions}
          setSortCategory={setSortCategory}
          sortCategory={sortCategory}
          setSortOrder={setSortOrder}
        />
      )}
    </View>
  );
};

export default OrderListTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  search_sort_container: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#939598',
    color: '#939598',
    height: 40,
    borderRadius: 4,
    padding: 5,
  },
  search_input: {
    height: '100%',
    borderRightWidth: 1,
    borderRightColor: '#939598',
    padding: 0,
    flex: 1,
    color: 'black',
    marginRight: 5,
  },
  headerBar: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  sort_icon: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#939598',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sort_image: {
    width: '80%',
    height: '80%',
  },
  filter_icon: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  search_sort_filter: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-evenly',
    paddingLeft: 10,
    paddingRight: 10,
  },
});
