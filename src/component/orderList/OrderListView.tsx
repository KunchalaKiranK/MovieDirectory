import React, {useState} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {OrderListProp} from '../../_feature/orderLists';
import {getOrderData, ORDER_STATUS} from '../../utils';
import {
  updateGalleryMedia,
  updateLuggageIntialState,
  updateScriptInitialState,
  updateUserIntialState,
} from '../../_feature';
import {useAppDispatch} from '../../_app';

interface MediaType {
  category: string;
  dateCreated: string;
  dateModified: string;
  deptCode: string;
  descPrefix: string;
  descText: string;
  fileSize: number;
  generatedImageFilePath: string;
  guid: string;
  imageFileName: string;
  imageHeight: number;
  imageId: string;
  imageType: number;
  imageWidth: number;
  mimeType: string;
  orderNumber: string;
  releaseDate: string;
  scanDate: string;
  thumbnailSize: 18304;
  webFileName: string;
}

interface IProps extends OrderListProp {
  user: string;
}

const OrderListCard = (props: IProps) => {
  let {
    city,
    clientId,
    orderNumber,
    postalCode,
    state,
    street1,
    status,
    dueDate,
    loanType,
    user,
  } = props;
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const [collapse, setCollapse] = useState(true);

  const handleNavigateToScriptEngine = async () => {
    dispatch(updateUserIntialState({orderNumber: orderNumber}));

    const script: any = await getOrderData(orderNumber, 'script');
    const luggage: any = await getOrderData(orderNumber, 'luggage');
    const media: any = await getOrderData(orderNumber, 'media');

    console.log('====================================');
    console.log(typeof script, 'script');
    console.log(script);
    console.log(typeof luggage, typeof JSON.parse(luggage), 'luggage');
    console.log(typeof media, typeof JSON.parse(media), 'media');
    console.log('====================================');

    if (script !== undefined) {
      let data = JSON.parse(script);
      dispatch(
        updateScriptInitialState({
          scriptType: 'survey',
          data,
        }),
      );
    }
    if (luggage !== undefined) {
      let luggageData = JSON.parse(luggage);
      dispatch(updateLuggageIntialState(luggageData));
    }
    if (media !== undefined) {
      let galleryMedia: MediaType[] = JSON.parse(media);
      dispatch(updateGalleryMedia({galleryMedia}));
    }
    navigation.navigate('OrderDetails');
  };

  return (
    <View style={styles.itemContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>WO Number: {orderNumber}</Text>
      </View>
      <Pressable onPress={handleNavigateToScriptEngine}>
        <View style={styles.itemView}>
          <Image
            style={styles.orderImage}
            source={require('../../assets/images/placeholder.png')}
          />
          <View style={styles.orderContent}>
            <View
              style={{
                ...styles.itemView,
                justifyContent: 'space-between',
                width: '65%',
              }}>
              {/* <View> */}
              <Text
                style={{
                  ...styles.subtitle,
                  color: ORDER_STATUS[status].color,
                  borderColor: ORDER_STATUS[status].color,
                }}>
                {ORDER_STATUS[status].key}
              </Text>
              {/* </View> */}
              <Pressable
                onPress={() => setCollapse(!collapse)}
                style={styles.collapse}>
                <Text style={{color: 'black'}}>^</Text>
              </Pressable>
            </View>
            <Text
              style={
                styles.address
              }>{`${street1} ${city}, ${state}, ${postalCode}`}</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            padding: 7,
          }}>
          <View style={styles.flex_oneTwo}>
            <Text style={styles.text_gray}>Window Start</Text>
            <Text style={styles.text_black}>07/18/22</Text>
          </View>
          <View style={styles.flex_one}>
            <Text style={styles.text_gray}>Due Date</Text>
            <Text style={styles.text_black}>{dueDate.substring(0, 10)}</Text>
          </View>
          <View style={styles.flex_zeroNine}>
            <Text style={styles.text_gray}>Code</Text>
            <Text style={styles.text_black}>{loanType.split('_')[1]}</Text>
          </View>
        </View>
        {!collapse && (
          <>
            <View
              style={{
                flexDirection: 'row',
                padding: 7,
                height: 'auto',
              }}>
              <View style={styles.flex_oneTwo}>
                <Text style={styles.text_gray}>Assignment</Text>
                <Text style={styles.text_black}>{user}</Text>
              </View>
              <View style={styles.flex_one}>
                <Text style={styles.text_gray}>Order Date</Text>
                <Text style={styles.text_black}>
                  {dueDate.substring(0, 10)}
                </Text>
              </View>
              <View style={styles.flex_zeroNine}>
                <Text style={styles.text_gray}>Client</Text>
                <Text style={styles.text_black}>{clientId}</Text>
              </View>
            </View>
            <View
              style={{
                padding: 7,
              }}>
              <Pressable style={styles.tag_as}>
                <Text style={styles.text_purple}>Tag as</Text>
              </Pressable>
            </View>
          </>
        )}
      </Pressable>
    </View>
  );
};

export default OrderListCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  header: {
    backgroundColor: '#F5F5F5',
    padding: 7,
  },
  title: {
    fontSize: 14,
    color: 'black',
  },
  subtitle: {
    fontSize: 12,
    color: 'black',
    borderWidth: 1,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 6,
    paddingRight: 6,
    borderRadius: 3,
    borderColor: 'black',
  },
  address: {
    color: 'black',
    fontSize: 12,
    width: '70%',
    flexWrap: 'wrap',
  },
  itemContainer: {
    backgroundColor: 'white',
    margin: 10,
    borderColor: '#D6D6D7',
    borderWidth: 1,
    borderRadius: 5,
    overflow: 'hidden',
  },
  itemView: {
    flexDirection: 'row',
  },
  orderImage: {
    width: 70,
    height: 70,
    margin: 10,
    borderColor: 'black',
    borderWidth: 1,
  },
  orderContent: {
    justifyContent: 'center',
    flexDirection: 'column',
  },
  sepratorLine: {
    height: 1,
    width: '100%',
    backgroundColor: 'black',
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.3)',
  },
  search_input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#000',
    color: '#000',
    padding: 10,
    margin: 10,
    width: '80%',
  },
  collapse: {
    backgroundColor: '#F5F5F5',
    height: 20,
    width: 20,
    borderRadius: 2,
  },
  text_gray: {
    color: '#585859',
  },
  text_black: {
    color: '#2C2C2C',
  },
  flex_oneTwo: {
    flex: 1.2,
  },
  flex_one: {
    flex: 1,
  },
  flex_zeroNine: {
    flex: 0.9,
  },
  tag_as: {
    backgroundColor: 'rgba(128, 0, 128, 0.05)',
    height: 32,
    borderWidth: 1,
    borderColor: '#800080',
    borderRadius: 4,
  },
  text_purple: {
    color: '#800080',
    textAlign: 'center',
    lineHeight: 24,
  },
});
