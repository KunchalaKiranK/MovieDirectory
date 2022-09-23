import React from 'react';
import {StyleSheet, View} from 'react-native';

import AppDimensions from '../../utils/AppDimensions';

const GridView = () => {
  const lines = [1, 2, 3];

  const gridHeight =
    AppDimensions.window.height -
    (AppDimensions.appHeaderHeight + AppDimensions.cameraactionAreaHeight);
  return (
    <View style={[styles.gridView, {height: gridHeight}]}>
      <View style={[styles.horizonatlGridView, {height: gridHeight}]}>
        {lines.map(() => {
          return <View style={styles.horizonatlGridLine}></View>;
        })}
      </View>
      <View style={[styles.verticalGridView, {height: gridHeight}]}>
        {lines.map(() => {
          return (
            <View
              style={[styles.verticalGridLine, {height: gridHeight}]}></View>
          );
        })}
      </View>
    </View>
  );
};

export default GridView;

const styles = StyleSheet.create({
  gridView: {
    position: 'absolute',
    top: AppDimensions.appHeaderHeight / 2,
    bottom: AppDimensions.appHeaderHeight,
    width: AppDimensions.window.width,
    backgroundColor: 'transparent',
  },
  horizonatlGridView: {
    position: 'absolute',
    width: AppDimensions.window.width,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignContent: 'space-between',
  },
  horizonatlGridLine: {
    width: AppDimensions.window.height,
    height: 0.5,
    backgroundColor: 'white',
  },
  verticalGridView: {
    position: 'absolute',
    top: AppDimensions.appHeaderHeight / 2,
    width: AppDimensions.window.width,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignContent: 'space-between',
  },
  verticalGridLine: {
    width: 0.5,
    backgroundColor: 'white',
  },
});
