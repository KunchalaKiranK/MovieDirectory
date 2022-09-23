import React, {useRef} from 'react';
import {StyleSheet, Text} from 'react-native';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';

const CustomizeList = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = ['80%'];

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      index={0}
      enablePanDownToClose={true}
      enableHandlePanningGesture={true}
      //   onClose={() => setIsOpen(false)}
      //   containerHeight={500}
      //   enableContentPanningGesture={true}
      //   enableHandlePanningGesture={true}
      //   enableOverDrag={true}
    >
      <BottomSheetView style={styles.contentContainer}>
        <Text style={styles.text}>asdasdasda</Text>
        <Text>asdasdasda</Text>
        <Text>asdasdasda</Text>
        <Text>asdasdasda</Text>
        <Text>asdasdasda</Text>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default CustomizeList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  text: {
    color: 'black',
  },
});
