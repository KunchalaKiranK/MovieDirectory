import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Alert, Image, Pressable, StyleSheet, View} from 'react-native';

import {CLOSE_ICON, SETTINGS_ICON} from '../../utils';
import AppDimensions from '../../utils/AppDimensions';
import ColorConstants from '../../utils/ColorConstants';

const TopView = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.topActionRow}>
      <Pressable
        style={({pressed}) => [
          {
            opacity: pressed ? 0 : 1,
          },
          styles.btnMargin,
        ]}
        onPress={() => {
          Alert.alert('Comin Soon..');
        }}>
        <View style={[styles.btnView]}>
          <Image
            style={styles.settingIcon}
            resizeMethod="auto"
            source={SETTINGS_ICON}
          />
        </View>
      </Pressable>

      <Pressable
        style={({pressed}) => [
          {
            opacity: pressed ? 0 : 1,
          },
          styles.btnMargin,
        ]}
        onPress={() => {
          navigation.goBack();
        }}>
        <View style={styles.btnView}>
          <Image
            style={styles.closeIcon}
            resizeMethod="auto"
            source={CLOSE_ICON}
          />
        </View>
      </Pressable>
    </View>
  );
};

export default TopView;

const styles = StyleSheet.create({
  topActionRow: {
    backgroundColor: 'transparent',
    width: AppDimensions.window.width,
    height: AppDimensions.appHeaderHeight,
    position: 'absolute',
    overflow: 'hidden',
    flexDirection: 'row',
    top: AppDimensions.appHeaderHeight,
    marginTop: AppDimensions._10,
    justifyContent: 'space-between',
  },
  btnView: {
    width: AppDimensions._40,
    height: AppDimensions._40,
    backgroundColor: ColorConstants.translucentGrey,
    borderRadius: AppDimensions._20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingIcon: {
    width: 25,
    height: 27,
  },
  closeIcon: {
    width: 30,
    height: 30,
  },
  btnMargin: {
    marginLeft: 10,
    marginRight: 10,
  },
});
