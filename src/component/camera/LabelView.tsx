import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';

import {ADD_LABEL_ICON} from '../../utils';
import AppDimensions from '../../utils/AppDimensions';
import ColorConstants from '../../utils/ColorConstants';
import StringsConstants from '../../utils/StringsConstants';

const LabelView = () => {
  return (
    <View style={styles.labelContainer}>
      <Pressable
        style={({pressed}) => [
          {
            opacity: pressed ? 0 : 1,
          },
          styles.labelBtn,
        ]}>
        <Image
          style={styles.labelImage}
          resizeMethod="auto"
          source={ADD_LABEL_ICON}
        />
        <Text style={styles.labelText}>{StringsConstants.ADD_LABEL}</Text>
      </Pressable>
    </View>
  );
};

export default LabelView;

const styles = StyleSheet.create({
  labelContainer: {
    backgroundColor: 'tranparent',
    width: AppDimensions.window.width,
    height: AppDimensions._60,
    position: 'absolute',
    overflow: 'hidden',
    flexDirection: 'row',
    bottom: AppDimensions.cameraactionAreaHeight,
    marginBottom: AppDimensions._5,
    justifyContent: 'center',
  },
  labelBtn: {
    height: 40,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: ColorConstants.white,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'center',
    flexDirection: 'row',
  },
  labelImage: {width: 15, height: 20, marginRight: 10},
  labelText: {
    color: ColorConstants.white,
    fontSize: 13,
  },
});
