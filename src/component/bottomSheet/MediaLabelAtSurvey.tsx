import React, {useEffect, useRef} from 'react';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';

import {useAppSelector} from '../../_app';
import {MediaLabelsAtSurvey} from '../mediaViewer';
import {StyleSheet} from 'react-native';

const MediaLabelAtSurvey = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const stationSheetStatus = useAppSelector(
    state => state.user.bottomSheetModal.mediaAtSurvey,
  );

  // variables
  const snapPoints = ['1%', '25%'];

  useEffect(() => {
    if (!stationSheetStatus) {
      bottomSheetRef.current?.close();
    } else {
      bottomSheetRef.current?.expand();
    }
  }, [stationSheetStatus]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      containerHeight={100}
      detached={true}
      enablePanDownToClose={false}
      enableContentPanningGesture={false}
      enableHandlePanningGesture={false}
      enableOverDrag={false}>
      <BottomSheetScrollView
        contentContainerStyle={styles.container}
        horizontal={true}>
        <MediaLabelsAtSurvey />
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default MediaLabelAtSurvey;

const styles = StyleSheet.create({
  container: {
    minWidth: '100%',
  },
});
