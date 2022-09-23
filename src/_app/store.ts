import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  languageReducer,
  userReducer,
  orderListReducer,
  scriptReducer,
  luggageReducer,
  galleryReducer,
  filterListReducer,
} from '../_feature';

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  // whiteList: ["transport"],
  // blacklist: ['script', 'luggage', 'lang', 'gallery', 'user', 'transport'],
};
const rootReducer = combineReducers({
  user: userReducer,
  lang: languageReducer,
  orderList: orderListReducer,
  script: scriptReducer,
  luggage: luggageReducer,
  gallery: galleryReducer,
  filterList: filterListReducer,
  //   transport: transportReducer,
});

// export type RootState = ReturnType<typeof rootReducer>;
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

export let persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
