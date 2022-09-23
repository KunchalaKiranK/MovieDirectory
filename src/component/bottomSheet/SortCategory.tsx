import React, {useEffect, useRef} from 'react';
import {FlatList, Pressable, StyleSheet, Text} from 'react-native';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';

interface IProps {
  label: string;
  value: string;
}

const sortOptions: IProps[] = [
  //   {
  //     label: 'Order Date',
  //     value: 'orderDate',
  //   },
  {
    label: 'Client',
    value: 'clientId',
  },
  {
    label: 'Type',
    value: 'loanType',
  },
  {
    label: 'City',
    value: 'city',
  },
];

const SortCategory = (props: {
  showSortOptions: boolean;
  setShowSortOptions: (p: boolean) => void;
  setSortCategory: (p: any) => void;
  sortCategory: any;
  setSortOrder: (p: number) => void;
}) => {
  const {
    showSortOptions,
    setShowSortOptions,
    sortCategory,
    setSortCategory,
    setSortOrder,
  } = props;
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = ['40%'];

  //Bottom sheet popup and out - some issue
  //   useEffect(() => {
  //     console.log("sadsdsd");

  //     if (!showSortOptions) {
  //       bottomSheetRef.current?.close();
  //       console.log(showSortOptions);
  //     } else bottomSheetRef.current?.snapToIndex(0);
  //   }, [showSortOptions]);

  // useEffect(() => {
  //   if (bottomSheetRef.current) bottomSheetRef.current.close();
  //   bottomSheetRef.current?.close();
  // }, [bottomSheetRef]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      //   index={0}
      enablePanDownToClose={true}
      enableHandlePanningGesture={true}
      //   onClose={() => setIsOpen(false)}
      //   containerHeight={500}
      //   enableContentPanningGesture={true}
      //   enableHandlePanningGesture={true}
      //   enableOverDrag={true}
    >
      <BottomSheetView style={styles.container}>
        <FlatList
          data={sortOptions}
          renderItem={({item}: {item: IProps}) => (
            <Pressable
              style={styles.sort_category}
              onPress={() => {
                if (sortCategory.value !== item.value) {
                  setShowSortOptions(false);
                  setSortCategory(item);
                  //   bottomSheetRef.current?.close();
                } else {
                  setShowSortOptions(false);
                  setSortOrder((prev: number) => prev * -1);
                }
              }}>
              <Text style={styles.text}>{item.label}</Text>
            </Pressable>
          )}
        />
      </BottomSheetView>
    </BottomSheet>
  );
};

export default SortCategory;

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
  sort_category: {
    height: 40,
    marginBottom: 5,
  },
  text: {
    color: 'black',
    fontSize: 16,
  },
});
