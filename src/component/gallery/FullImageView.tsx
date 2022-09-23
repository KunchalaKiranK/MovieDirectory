import React, {useState} from 'react';
import {FlatList, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';

import {ADD_LABEL_ICON, INFO_ICON, LABEL_ICON} from '../../utils';
import AppDimensions from '../../utils/AppDimensions';
import ColorConstants from '../../utils/ColorConstants';
import StringsConstants from '../../utils/StringsConstants';

const FullImageView = ({route}: {route: any}) => {
  const {imageList} = route.params;
  const {selectedItem} = route.params;
  const [selectedIndex, setSelectedIndex] = useState(selectedItem);

  const renderItem = ({item, index}: {item: any; index: number}) => (
    <Pressable
      style={({pressed}) => [
        {
          opacity: pressed ? 0 : 1,
        },
      ]}
      onPress={() => {
        setSelectedIndex(index);
      }}>
      <View style={styles.listItemContainer}>
        <Image
          source={{uri: `file://${item.path}`}}
          style={[
            styles.imageIcon,
            index === selectedIndex ? styles.border : styles.noBorder,
          ]}
        />
        <Image source={LABEL_ICON} style={styles.labelIcon} />
      </View>
    </Pressable>
  );
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageZoom
          cropWidth={AppDimensions.window.width - 30}
          cropHeight={AppDimensions.window.height - 300}
          imageWidth={AppDimensions.window.width - 10}
          imageHeight={AppDimensions.window.height - 300}
          panToMove={true}
          minScale={0.6}
          maxScale={10}>
          <Image
            style={styles.image}
            source={{
              uri: `file://${imageList[selectedIndex].path}`,
            }}
          />
        </ImageZoom>
      </View>

      <Image style={styles.infoImage} source={INFO_ICON} />
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
      <View style={styles.flatListContainer}>
        <FlatList
          horizontal
          data={imageList}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>
    </View>
  );
};

export default FullImageView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: ColorConstants.white,
  },
  imageContainer: {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: ColorConstants.white,
    width: AppDimensions.window.width - 30,
    height: AppDimensions.window.height - 300,
    overflow: 'hidden',
  },
  image: {
    width: AppDimensions.window.width - 30,
    height: AppDimensions.window.height - 300,
    borderRadius: 5,
    marginLeft: 10,
  },
  infoImage: {
    width: 30,
    height: 30,
    bottom: 290,
    right: 40,
    backgroundColor: ColorConstants.translucentGrey,
    position: 'absolute',
  },
  labelContainer: {
    width: AppDimensions.window.width,
    height: AppDimensions._60,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: AppDimensions._20,
  },
  labelBtn: {
    height: 40,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: ColorConstants.white,

    backgroundColor: ColorConstants.translucentGrey,
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
  flatListContainer: {
    width: AppDimensions.window.width - 15,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'center',
    marginTop: 10,
  },

  listItemContainer: {
    borderColor: 'grey',
    marginLeft: 15,
    marginBottom: 15,
    overflow: 'hidden',
  },
  imageIcon: {
    width: AppDimensions.window.width / 4,
    height: AppDimensions.window.width / 4,
    backgroundColor: 'black',
  },
  border: {
    borderColor: ColorConstants.black,
    borderWidth: 3,
  },
  noBorder: {
    borderColor: ColorConstants.lightGrey,
    borderWidth: 1,
  },
  labelIcon: {
    position: 'absolute',
    left: 3,
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
  },
});
