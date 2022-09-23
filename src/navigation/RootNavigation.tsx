import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {useAppSelector} from '../_app';
import {
  AssignmentsScreen,
  CameraScreen,
  FilterScreen,
  GalleryScreen,
  LoginScreen,
  MarketplaceScreen,
  SchedulingScreen,
} from '../screen';
import {FullImageView} from '../component';
import OrderListTab from './OrderListNavigation';
import {StyleSheet, View} from 'react-native';
import OrderDetailsStackNavigation from './OrderDetailsNavigation';

const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();

// navigate without login
const PublicNavigation = () => (
  <Stack.Navigator initialRouteName="Login">
    <Stack.Screen
      name="Login"
      options={{headerShown: false}}
      component={LoginScreen}
    />
  </Stack.Navigator>
);

// navigate after login
const PrivateNavigation = () => (
  <BottomTab.Navigator initialRouteName="Orders">
    <BottomTab.Screen
      options={{
        tabBarIcon: ({focused}) => <View style={styles.icon(focused)} />,
        headerShown: false,
      }}
      name="Orders"
      component={OrderListTab}
    />
    <BottomTab.Screen
      options={{
        tabBarIcon: ({focused}) => <View style={styles.icon(focused)} />,
      }}
      name="Assignments"
      component={AssignmentsScreen}
    />
    <BottomTab.Screen
      options={{
        tabBarIcon: ({focused}) => <View style={styles.icon(focused)} />,
      }}
      name="Scheduling"
      component={SchedulingScreen}
    />
    <BottomTab.Screen
      options={{
        tabBarIcon: ({focused}) => <View style={styles.icon(focused)} />,
      }}
      name="Marketplace"
      component={MarketplaceScreen}
    />
  </BottomTab.Navigator>
);

const AppNavigation = () => (
  <Stack.Navigator initialRouteName="ORDERS">
    <Stack.Screen
      name="ORDERS"
      options={{headerShown: false}}
      component={PrivateNavigation}
    />
    <Stack.Screen
      options={{headerShown: false}}
      name="OrderDetails"
      component={OrderDetailsStackNavigation}
    />
    <Stack.Screen
      options={{headerShown: false}}
      name="Gallery"
      component={GalleryScreen}
    />
    <Stack.Screen
      options={{headerShown: false}}
      name="Camera"
      component={CameraScreen}
    />
    <Stack.Screen name="image" component={FullImageView} />
    <Stack.Screen
      name="FilterOptions"
      options={{headerShown: false}}
      component={FilterScreen}
    />
  </Stack.Navigator>
);

const RootNavigation = () => {
  const user = useAppSelector(state => state.user.user);

  return (
    <NavigationContainer>
      {user ? <AppNavigation /> : <PublicNavigation />}
    </NavigationContainer>
  );
};

export default RootNavigation;

const styles = StyleSheet.create({
  icon: focused => ({
    borderWidth: 2,
    height: 30,
    width: 30,
    borderRadius: 30,
    borderColor: focused ? 'blue' : 'pink',
  }),
});
