import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import RNFS from 'react-native-fs';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import {useNavigation} from '@react-navigation/native';
import {FloatingAction} from 'react-native-floating-action';

import ColorConstants from '../../utils/ColorConstants';
import AppDimensions from '../../utils/AppDimensions';
import {CAMERA_ICON, CHECKED_ICON, LABEL_ICON, RESIZE_ICON} from '../../utils';

const GalleryView = (props: any) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSelectionEnabled, setSelectionEnabled] = useState(false);
  const handleIndexChange = (index: number) => {
    setSelectedIndex(index);
  };
  const result = props.imagesList.filter(obj => {
    return obj.orderNumber.toString() === props.orderNumber;
  });
  const [imagesArrayList, setImagesList] = useState([]);
  const navigation = useNavigation<any>();
  const [resolutionVisible, setResolutionVisible] = useState(false);
  const [selectedSize, setSelectedSize] = useState(3);
  let listItem: any[] = [];
  // const actions = [
  //   {
  //     text: 'Accessibility',
  //     icon: require('../../assets/images/camera/camera_icon.png'),
  //     name: 'bt_accessibility',
  //     position: 2,
  //   },
  // ];

  useEffect(() => {
    filterExistingFiles().then(result => {
      setImagesList(result);
    });
  }, []);

  async function filterExistingFiles(): Promise<any> {
    for (var val of result) {
      console.log(val);
      await isFileExist(val, props, listItem);
    }
    return listItem;
  }
  const renderItem = ({item, index}: {item: any; index: number}) => (
    <Pressable
      onPress={() => {
        if (!isSelectionEnabled) {
          navigation.navigate('image', {
            imageList: imagesArrayList,
            selectedItem: index,
          });
        } else {
          let newArray = [...imagesArrayList];
          newArray[index] = {
            ...newArray[index],
            isSelected: !imagesArrayList[index].isSelected,
          };
          setImagesList(newArray);
        }
      }}
      onLongPress={() => {
        setSelectionEnabled(!isSelectionEnabled);
      }}
      style={({pressed}) => [
        {
          opacity: pressed ? 0.5 : 1,
        },
      ]}>
      <View style={styles.listItemContainer}>
        <Image
          source={{uri: `file://${item.path}`}}
          style={
            selectedSize === 3
              ? styles.largeIcon
              : selectedSize === 4
              ? styles.mediumIcon
              : styles.smallIcon
          }
        />
        {selectedIndex === 1 ? (
          <Image source={LABEL_ICON} style={styles.labelIcon} />
        ) : null}
        {selectedIndex === 2 && isSelectionEnabled ? (
          <View style={[styles.slectedView]} />
        ) : null}
        {item.isSelected && selectedIndex === 2 && isSelectionEnabled ? (
          <Image source={CHECKED_ICON} style={styles.checkedIcon} />
        ) : null}
      </View>
    </Pressable>
  );

  const handleFileUpload = () => {
    const selectedImages = imagesArrayList.filter((obj: any) => {
      return obj.isSelected === true;
    });

    //Selected images to upload
    console.log('File Upload Action', JSON.stringify(selectedImages));
  };

  return (
    <View style={styles.container}>
      <View style={styles.galleryContainer}>
        <SegmentedControlTab
          values={['All', 'Labelled', 'Unlabeled']}
          selectedIndex={selectedIndex}
          onTabPress={handleIndexChange}
          tabsContainerStyle={styles.tabsContainerStyle}
          tabStyle={styles.tabStyle}
          firstTabStyle={styles.firstTabStyle}
          lastTabStyle={styles.lastTabStyle}
          tabTextStyle={styles.tabTextStyle}
          activeTabStyle={styles.activeTabStyle}
          activeTabTextStyle={styles.activeTabTextStyle}
          borderRadius={8}
        />
        <View style={styles.galleryListContainer}>
          <View style={styles.galleryContentHeader}>
            <View style={styles.totalLabelContainer}>
              <Text style={styles.totalLabel}>{'Total Files :'}</Text>
              <Text style={styles.totalCount}>{imagesArrayList.length}</Text>
              <View style={styles.pipe} />
              <Pressable
                style={({pressed}) => [
                  {
                    opacity: pressed ? 0 : 1,
                  },
                ]}
                onPress={() => {
                  setResolutionVisible(!resolutionVisible);
                }}>
                <Image
                  style={styles.resizeIcon}
                  resizeMethod="auto"
                  source={RESIZE_ICON}
                />
              </Pressable>
            </View>
            {selectedIndex === 2 ? (
              <Pressable
                style={({pressed}) => [
                  {
                    opacity: pressed ? 0 : 1,
                  },
                  styles.selectBtn,
                ]}
                onPress={() => {
                  setSelectionEnabled(!isSelectionEnabled);
                }}>
                <View style={styles.allSelect} />
                <Text
                  style={[
                    styles.selectText,
                    selectedIndex === 2 && isSelectionEnabled
                      ? {color: ColorConstants.black}
                      : {color: ColorConstants.lightGrey},
                  ]}>
                  Select
                </Text>
              </Pressable>
            ) : null}
          </View>

          <View style={styles.flatListContainer}>
            <FlatList
              key={selectedSize}
              data={imagesArrayList}
              renderItem={renderItem}
              numColumns={selectedSize}
              keyExtractor={item => item.id}
            />
          </View>
          <FloatingAction
            floatingIcon={CAMERA_ICON}
            showBackground={false}
            color={ColorConstants.white}
            distanceToEdge={{vertical: 40, horizontal: 40}}
            onPressMain={() => {
              navigation.replace('Camera', {orderNumber: props.orderNumber});
            }}
          />

          <Modal
            animationType="slide"
            transparent={true}
            statusBarTranslucent={true}
            visible={resolutionVisible}
            onRequestClose={() => {
              setResolutionVisible(false);
            }}>
            <View style={styles.modalView}>
              <Pressable
                style={({pressed}) => [
                  {
                    opacity: pressed ? 0 : 1,
                  },
                  styles.sizeSelectView,
                  selectedSize === 5
                    ? {backgroundColor: ColorConstants.lightGrey}
                    : {backgroundColor: ColorConstants.white},
                ]}
                onPress={() => {
                  setSelectedSize(5);
                  setResolutionVisible(false);
                }}>
                <Text style={styles.sizeText}>{'Small'}</Text>
              </Pressable>
              <Pressable
                style={({pressed}) => [
                  {
                    opacity: pressed ? 0 : 1,
                  },
                  styles.sizeSelectView,
                  selectedSize === 4
                    ? {backgroundColor: ColorConstants.lightGrey}
                    : {backgroundColor: ColorConstants.white},
                ]}
                onPress={() => {
                  setSelectedSize(4);
                  setResolutionVisible(false);
                }}>
                <Text style={styles.sizeText}>{'Medium'}</Text>
              </Pressable>
              <Pressable
                style={({pressed}) => [
                  {
                    opacity: pressed ? 0 : 1,
                  },
                  styles.sizeSelectView,
                  selectedSize === 3
                    ? {backgroundColor: ColorConstants.lightGrey}
                    : {backgroundColor: ColorConstants.white},
                ]}
                onPress={() => {
                  setSelectedSize(3);
                  setResolutionVisible(false);
                }}>
                <Text style={styles.sizeText}>{'Large'}</Text>
              </Pressable>
            </View>
          </Modal>
        </View>
      </View>
      {resolutionVisible ? <View style={styles.modalBackground} /> : null}
    </View>
  );
};

export default GalleryView;

async function isFileExist(val: any, props: any, listItem: any) {
  let exists = await RNFS.exists(val.path);
  if (exists) {
    listItem.push(val);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorConstants.white,
  },
  galleryContainer: {
    flex: 1,
    marginTop: 15,
    backgroundColor: ColorConstants.white,
  },

  tabsContainerView: {
    borderColor: 'black',
  },
  tabsContainerStyle: {
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 10,
    height: 40,
    marginLeft: 15,
    marginRight: 15,
  },
  tabStyle: {
    borderColor: 'white',
    borderWidth: 0,
  },
  firstTabStyle: {},
  lastTabStyle: {},
  tabTextStyle: {
    color: 'black',
  },
  activeTabStyle: {
    backgroundColor: 'grey',
  },
  activeTabTextStyle: {
    color: 'white',
  },
  galleryListContainer: {
    alignItems: 'flex-start',
    justifyContent: 'space-around',
  },

  listItemContainer: {
    borderColor: 'grey',
    marginLeft: 15,
    paddingBottom: 15,
    overflow: 'hidden',
  },

  uploadBtn: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    alignContent: 'flex-end',
    padding: 10,
    borderRadius: 10,
    marginLeft: '60%',
  },
  uploadText: {
    color: 'white',
  },
  resizeIcon: {
    width: 25,
    height: 25,
  },
  galleryContentHeader: {
    width: AppDimensions.window.width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 30,
    marginBottom: 15,
  },
  totalLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '400',
    color: ColorConstants.black,
  },
  totalCount: {fontSize: 16, fontWeight: '600', color: ColorConstants.black},
  pipe: {
    height: '100%',
    width: 1,
    backgroundColor: ColorConstants.lightGrey,
    marginLeft: 10,
    marginRight: 10,
  },
  selectText: {
    fontSize: 14,
    fontWeight: '400',
    color: ColorConstants.lightGrey,
  },
  flatListContainer: {
    width: AppDimensions.window.width,
    height: AppDimensions.window.height - 200,
    alignItems: 'center',
    marginTop: 10,
    paddingBottom: 30,
    paddingRight: 10,
  },
  largeIcon: {
    width: AppDimensions.window.width / 3 - 20,
    height: AppDimensions.window.width / 3 - 20,
    backgroundColor: 'black',
  },
  mediumIcon: {
    width: AppDimensions.window.width / 3 - 50,
    height: AppDimensions.window.width / 3 - 50,
    backgroundColor: 'black',
  },
  smallIcon: {
    width: AppDimensions.window.width / 3 - 70,
    height: AppDimensions.window.width / 3 - 70,
    backgroundColor: 'black',
  },
  labelIcon: {
    position: 'absolute',
    top: 5,
    width: 20,
    height: 12,
  },
  slectedView: {
    position: 'absolute',
    top: 5,
    left: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: ColorConstants.white,
    backgroundColor: ColorConstants.grey,
  },
  allSelect: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: ColorConstants.lightGrey,
    backgroundColor: ColorConstants.white,
    marginRight: 10,
  },
  checkedIcon: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 10,
    height: 10,
    justifyContent: 'center',
  },
  modalView: {
    backgroundColor: ColorConstants.white,
    bottom: -10,
    position: 'absolute',
    width: '100%',
    height: '30%',
    paddingLeft: 10,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 60,
    borderRadius: 10,
    justifyContent: 'center',
  },
  sizeText: {
    fontSize: 16,
  },
  sizeSelectView: {
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 10,
    width: '100%',
  },
  modalBackground: {
    position: 'absolute',
    width: AppDimensions.window.width,
    height: AppDimensions.window.height,
    backgroundColor: ColorConstants.transparentLightBlack,
  },
});
