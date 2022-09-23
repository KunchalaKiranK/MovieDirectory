import React, {useEffect} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import withObservables from '@nozbe/with-observables';
import {ListItems, } from '../helpers/prompt'
import {OrderDetails, OrderInstruction, OrderNotes} from '../component';
import {useAppDispatch, useAppSelector} from '../_app';
import {OrderListProp} from '../_feature/orderLists';
import {orderListStatus, ORDER_LIST_FUNCTIONALITY} from '../utils';
import {
  CameraScreen,
  GalleryScreen,
  MediaLabelsScreen,
  QuestionScreen,
} from '../screen';
import {updateBottomSheetStatus} from '../_feature';

const TopTab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

// order details tab navigation
const Navigate = () => (
  <TopTab.Navigator>
    <TopTab.Screen name="Details" component={OrderDetails} />
    <TopTab.Screen name="Instructions" component={OrderInstruction} />
    <TopTab.Screen name="Notes" component={OrderNotes} />
  </TopTab.Navigator>
);

const OrderDetailsStackNavigation = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const stationSheetStatus = useAppSelector(
    state => state.user.bottomSheetModal.station,
  );
  const handleStationSheetToggle = () => {
    dispatch(
      updateBottomSheetStatus({status: !stationSheetStatus, type: 'station'}),
    );
  };

  return (
    <Stack.Navigator initialRouteName="OrderDetail">
      <Stack.Screen
        options={{
          headerLeft: () => (
            <Pressable onPress={() => navigation.goBack()}>
              <Text style={{color: 'red'}}>Back</Text>
            </Pressable>
          ),
        }}
        name="OrderDetail"
        component={OrderDetailsNavigation}
      />
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable onPress={handleStationSheetToggle}>
              <Text>Station</Text>
            </Pressable>
          ),
        }}
        name="Question"
        component={QuestionScreen}
      />
      <Stack.Screen name="Camera" component={CameraScreen} />
      <Stack.Screen name="Gallery" component={GalleryScreen} />
      <Stack.Screen name="Label" component={MediaLabelsScreen} />
    </Stack.Navigator>
  );
};

const OrderDetailsNavigation = () => {
  const navigation = useNavigation<any>();

  const orderList = useAppSelector(state => state.orderList.orderList);
  const currentOrder = useAppSelector(state => state.user.orderNumber);
  const currentOrderDetails: OrderListProp = orderList.filter(
    (item: OrderListProp) => item.orderNumber === currentOrder,
  )[0];
  const STATIONS = useAppSelector(state => state.script.survey.station);
  let {status} = currentOrderDetails;

  useEffect(() => {
    console.log('tadaaa', currentOrderDetails);
  }, [currentOrderDetails]);

  const handleNavigateToOrderDetails = (action: string) => {
    if (action === 'camera') {
      navigation.navigate('camera', {orderNumber: currentOrder});
    } else if (action === 'gallery') {
      console.log('Gallry btn click', action);
      navigation.navigate('gallery', {orderNumber: currentOrder});
    } else {
      navigation.navigate('Question', {station: STATIONS[0].Name});
    }
  };

  const handleNavigateToScreen = (screen: string) => {
    console.log('navigate to screen ', screen);
    navigation.navigate(screen);
  };

  return (
    <View style={{flex: 1}}>
      <Image
        style={style.forntHouse}
        source={{
          uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
        }}
      />
      <Navigate />
      <View>
        <View style={style.buttonConatiner}>
          <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            <Pressable onPress={() => handleNavigateToOrderDetails('camera')}>
              <Pressable
                style={style.label}
                onPress={() => handleNavigateToScreen('Camera')}>
                <Text>Camara</Text>
              </Pressable>
            </Pressable>
            <Pressable onPress={() => handleNavigateToOrderDetails('gallery')}>
              <Pressable
                style={style.label}
                onPress={() => handleNavigateToScreen('Gallery')}>
                <Text>Gallery</Text>
              </Pressable>
            </Pressable>
            <Pressable
              style={style.label}
              onPress={() => handleNavigateToScreen('Label')}>
              <Text>Label</Text>
            </Pressable>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            {orderListStatus(ORDER_LIST_FUNCTIONALITY.START, status) && (
              <Pressable
                onPress={() => handleNavigateToOrderDetails('start')}
                style={style.button}>
                <Text style={style.textButton}>Start</Text>
              </Pressable>
            )}
            {orderListStatus(ORDER_LIST_FUNCTIONALITY.RESTART, status) && (
              <Pressable
                onPress={() => handleNavigateToOrderDetails('restart')}
                style={style.button}>
                <Text style={style.textButton}>Restart</Text>
              </Pressable>
            )}
            {orderListStatus(ORDER_LIST_FUNCTIONALITY.RESUME, status) && (
              <Pressable
                onPress={() => handleNavigateToOrderDetails('resume')}
                style={style.button}>
                <Text style={style.textButton}>Resume</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default OrderDetailsStackNavigation;

const style = StyleSheet.create({
  forntHouse: {
    width: '100%',
    height: 200,
    borderWidth: 1,
    borderColor: 'grey',
  },
  buttonConatiner: {
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  label: {
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00f1',
    margin: 5,
  },
  button: {
    borderWidth: 1,
    padding: 5,
    minWidth: 100,
    width: 'auto',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButton: {
    fontSize: 16,
  },
});
