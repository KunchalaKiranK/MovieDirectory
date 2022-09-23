import React from 'react';
import {AppRegistry, Text} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import 'react-native-get-random-values';
import 'react-native-gesture-handler';

import App from './App';
import {name as appName} from './app.json';
import {persistor, store} from './src/_app';

AppRegistry.registerComponent(appName, () => Apps);

const Apps = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<Text>Loading....</Text>} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  );
};
