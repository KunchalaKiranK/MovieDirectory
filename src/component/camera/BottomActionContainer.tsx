import React, {useEffect, useRef, useState} from 'react';
import {Animated, Easing, StyleSheet} from 'react-native';

import AppDimensions from '../../utils/AppDimensions';
import ColorConstants from '../../utils/ColorConstants';

const BottomActionContainer = (props: any) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [isTop, setIsTop] = useState(false);
  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, AppDimensions.cameraactionAreaHeight],
    extrapolate: 'clamp',
  });
  const startAnimation = (toValue: any) => {
    Animated.timing(animatedValue, {
      toValue,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      setIsTop(!isTop);
    });
  };

  useEffect(() => {
    startAnimation(isTop ? 1 : 0);
  }, [props.clickHideBack]);

  return (
    <Animated.View
      style={[
        styles.actionBackgoundView,
        {transform: [{translateY}]},
      ]}></Animated.View>
  );
};

export default BottomActionContainer;

const styles = StyleSheet.create({
  actionBackgoundView: {
    width: AppDimensions.window.width,
    height: AppDimensions.cameraactionAreaHeight,
    backgroundColor: ColorConstants.black,
    position: 'absolute',
    bottom: 0,
  },
});
