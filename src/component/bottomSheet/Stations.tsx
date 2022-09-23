import React, {useRef, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';

import {useAppSelector} from '../../_app';
import Survey from '../../screen/Survey';

const Stations = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const stationSheetStatus = useAppSelector(
    state => state.user.bottomSheetModal.station,
  );

  // variables
  const snapPoints = ['1%', '80%'];

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
      enablePanDownToClose={true}
      onClose={undefined}
      containerHeight={500}
      enableContentPanningGesture={true}
      enableHandlePanningGesture={true}
      enableOverDrag={true}>
      <View style={styles.contentContainer}>
        <Survey />
      </View>
    </BottomSheet>
  );
};

export default Stations;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    minHeight: 500,
    backgroundColor: '#fff',
  },
});
