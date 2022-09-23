import React, {useEffect, useState} from 'react';
import {
  Image,
  LayoutAnimation,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  UIManager,
  View,
} from 'react-native';
import {
  BRIGHTNESS_ICON,
  DOCUMENT,
  FLASH_ICON,
  FLIP_CAMERA_ICON,
  GALLERY_ICON,
  GRID_ICON,
  IMAGE_CAPTURE_ICON,
  IMAGE_PLACEHODER_ICON,
  TIMER_ICON,
  VIDEO_RECORDING,
} from '../../utils';
import AppDimensions from '../../utils/AppDimensions';
import ColorConstants from '../../utils/ColorConstants';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const BottomView = (props: any) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedButton, setSelectedButton] = useState(0);
  const [leftSubBtnLabel, setLeftSubBtnLabel] = useState('');
  const [midLeftSubBtnLabel, setMidLeftSubBtnLabel] = useState('');
  const [midRightSubBtnLabel, setMidRightSubBtnLabel] = useState('');
  const [rightSubBtnLabel, setRightSubBtnLabel] = useState('');
  const [isSubActionEnabled, setSubActionEnasbled] = useState(false);
  const [imageUri, setImageUri] = useState('');
  const [selectedActions, setSelectedActions] = useState({
    docType: false,
    flashType: 'Always On',
    brightness: '100%',
    isVideoEnabled: false,
    isGridEnabled: false,
    timer: 'off',
  });
  const [gridStatus, setGridStatus] = useState(false);
  const [resolutionVisible, setResolutionVisible] = useState(false);
  const [isDocument, setIsDocumentType] = useState(false);
  const [flashType, setFlashType] = useState(3);
  const [brightnessType, setBrightnessType] = useState(3);
  const [timerType, setTimerType] = useState(3);
  const [selectedSubtype, setSelectedSubtype] = useState(3);

  useEffect(() => {
    console.log('Uri', props.capturedImageUri);
    setImageUri(props.capturedImageUri);
  }, [props.capturedImageUri]);

  return (
    <View style={styles.actionView}>
      <View
        style={[
          styles.topActionContainer,
          {
            borderRadius: 20,
            backgroundColor: expanded
              ? ColorConstants.transparentLightBlack
              : 'transparent',
          },
        ]}>
        {!expanded ? (
          <Pressable
            style={({pressed}) => [
              {
                opacity: pressed ? 0 : 1,
              },
            ]}
            onPress={() => {
              onButtonClick(0);
              setResolutionVisible(!resolutionVisible);
            }}>
            <View style={styles.btnActionView}>
              <Image
                style={isDocument ? styles.documentIcon : styles.galleryIcon}
                resizeMethod="auto"
                source={isDocument ? DOCUMENT : GALLERY_ICON}
              />
            </View>
          </Pressable>
        ) : null}
        {selectedButton === 1 || !expanded ? (
          <Pressable
            style={({pressed}) => [
              {
                opacity: pressed ? 0 : 1,
              },
            ]}
            onPress={() => {
              onButtonClick(1);
            }}>
            <View style={styles.btnActionView}>
              <Image
                style={styles.flashIcon}
                resizeMethod="auto"
                source={FLASH_ICON}
              />
            </View>
          </Pressable>
        ) : null}

        {selectedButton === 2 || !expanded ? (
          <Pressable
            style={({pressed}) => [
              {
                opacity: pressed ? 0 : 1,
              },
            ]}
            onPress={() => {
              onButtonClick(2);
            }}>
            <View style={styles.btnActionView}>
              <Image
                style={styles.birghtnessIcon}
                resizeMethod="auto"
                source={BRIGHTNESS_ICON}
              />
            </View>
          </Pressable>
        ) : null}

        {selectedButton === 3 || !expanded ? (
          <Pressable
            style={({pressed}) => [
              {
                opacity: pressed ? 0 : 1,
              },
            ]}
            onPress={() => {
              onButtonClick(3);
            }}>
            <View style={styles.btnActionView}>
              <Image
                style={styles.videorecordingIcon}
                resizeMethod="auto"
                source={VIDEO_RECORDING}
              />
            </View>
          </Pressable>
        ) : null}

        {selectedButton === 4 || !expanded ? (
          <Pressable
            style={({pressed}) => [
              {
                opacity: pressed ? 0 : 1,
              },
            ]}
            onPress={() => {
              onButtonClick(4);
              selectedActions.isGridEnabled = !selectedActions.isGridEnabled;
              setSelectedActions(selectedActions);
              setGridStatus(!gridStatus);
            }}>
            <View style={styles.btnActionView}>
              <Image
                style={[
                  styles.gridIcon,
                  {tintColor: gridStatus ? 'yellow' : 'white'},
                ]}
                resizeMethod="auto"
                source={GRID_ICON}
              />
            </View>
          </Pressable>
        ) : null}

        {selectedButton === 5 || !expanded ? (
          <Pressable
            style={({pressed}) => [
              {
                opacity: pressed ? 0 : 1,
              },
              styles.btnActionView,
            ]}
            onPress={() => {
              onButtonClick(5);
            }}>
            <View>
              <Image
                style={styles.timerIcon}
                resizeMethod="auto"
                source={TIMER_ICON}
              />
            </View>
          </Pressable>
        ) : null}

        {isSubActionEnabled && expanded ? (
          <Pressable
            style={({pressed}) => [
              {
                opacity: pressed ? 0 : 1,
              },
            ]}
            onPress={() => {
              subButtonClick(0);
            }}>
            <Text
              style={[
                styles.actionText,
                selectedSubtype === 0 ? {color: 'yellow'} : {color: 'white'},
              ]}>
              {leftSubBtnLabel}
            </Text>
          </Pressable>
        ) : null}
        {isSubActionEnabled && expanded ? (
          <Pressable
            style={({pressed}) => [
              {
                opacity: pressed ? 0 : 1,
              },
            ]}
            onPress={() => {
              subButtonClick(1);
            }}>
            <Text
              style={[
                styles.actionText,
                selectedSubtype === 1 ? {color: 'yellow'} : {color: 'white'},
              ]}>
              {midLeftSubBtnLabel}
            </Text>
          </Pressable>
        ) : null}
        {isSubActionEnabled && expanded ? (
          <Pressable
            style={({pressed}) => [
              {
                opacity: pressed ? 0 : 1,
              },
            ]}
            onPress={() => {
              subButtonClick(2);
            }}>
            <Text
              style={[
                styles.actionText,
                selectedSubtype === 2 ? {color: 'yellow'} : {color: 'white'},
              ]}>
              {midRightSubBtnLabel}
            </Text>
          </Pressable>
        ) : null}
        {isSubActionEnabled && expanded ? (
          <Pressable
            style={({pressed}) => [
              {
                opacity: pressed ? 0 : 1,
              },
            ]}
            disabled={false}
            onPress={() => {
              subButtonClick(3);
            }}>
            <Text
              style={[
                styles.actionText,
                {paddingRight: 5},
                selectedSubtype === 3 ? {color: 'yellow'} : {color: 'white'},
              ]}>
              {rightSubBtnLabel}
            </Text>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.bottomActionContainer}>
        <Pressable
          style={({pressed}) => [
            {
              opacity: pressed ? 0 : 1,
            },
          ]}
          onPress={() => {
            props.onClick(8);
          }}>
          <View style={styles.placeHolderView}>
            <Image
              style={styles.placeHolderIcon}
              resizeMethod="auto"
              source={
                props.capturedImageUri.length < 2
                  ? IMAGE_PLACEHODER_ICON
                  : {uri: `file://${imageUri}`}
              }
            />
          </View>
        </Pressable>

        <Pressable
          style={({pressed}) => [
            {
              opacity: pressed ? 0 : 1,
            },
          ]}
          onPress={() => {
            props.onClick(6);
          }}>
          <View>
            <Image
              style={styles.captureIcon}
              resizeMethod="auto"
              source={IMAGE_CAPTURE_ICON}
            />
          </View>
        </Pressable>

        <Pressable
          style={({pressed}) => [
            {
              opacity: pressed ? 0 : 1,
            },
          ]}
          onPress={() => {
            props.onClick(7);
          }}>
          <View style={styles.btnActionView}>
            <Image
              style={styles.flipIcon}
              resizeMethod="auto"
              source={FLIP_CAMERA_ICON}
            />
          </View>
        </Pressable>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        statusBarTranslucent={true}
        visible={resolutionVisible}
        onRequestClose={() => {
          setResolutionVisible(false);
        }}>
        <View style={styles.modalView}>
          <Text style={styles.resolutionTitle}>{'Resolution change'}</Text>
          <Text style={styles.resolutionDescription}>
            {
              'Changing the resolution to full scale is only advised when taking photos of documents.'
            }
          </Text>
          <View style={styles.btnView}>
            <Pressable
              style={({pressed}) => [
                {
                  opacity: pressed ? 0 : 1,
                },
                styles.cancelBtn,
              ]}
              onPress={() => {
                setResolutionVisible(false);
              }}>
              <Text style={{color: ColorConstants.grey, fontSize: 18}}>
                {'Cancel'}
              </Text>
            </Pressable>
            <Pressable
              style={({pressed}) => [
                {
                  opacity: pressed ? 0 : 1,
                },
                styles.okBtn,
              ]}
              onPress={() => {
                setResolutionVisible(false);
                setIsDocumentType(!isDocument);
              }}>
              <Text style={{color: 'white', fontSize: 18}}>{'Ok'}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
  function subButtonClick(subBtnType: number) {
    setSelectedSubtype(subBtnType);
    if (selectedButton === 1 && expanded) {
      setFlashType(subBtnType);
      console.log('Flash Selection', subBtnType);
    } else if (selectedButton === 2 && expanded) {
      setBrightnessType(subBtnType);
      console.log('Brightness Selection', subBtnType);
    } else if (selectedButton === 5 && expanded) {
      setTimerType(subBtnType);
      console.log('Timer Selection', subBtnType);
    }
  }
  function onButtonClick(btnType: number) {
    setSubActionEnasbled(false);
    if (btnType === 1 || btnType === 2 || btnType === 5) {
      setSelectedButton(btnType);
      setExpanded(!expanded);

      setTimeout(() => {
        setSubActionEnasbled(true);
      }, 100);
      LayoutAnimation.configureNext({
        duration: 300,
        create: {type: 'easeInEaseOut', property: 'opacity'},
        update: {type: 'easeInEaseOut', property: 'opacity'},
      });
    } else {
      props.onClick(btnType);
      setSubActionEnasbled(false);
    }

    switch (btnType) {
      case 1:
        setLeftSubBtnLabel('Auto');
        setMidLeftSubBtnLabel('On');
        setMidRightSubBtnLabel('Off');
        setRightSubBtnLabel('Always On');
        setSelectedSubtype(flashType);
        break;
      case 2:
        setLeftSubBtnLabel('25%');
        setMidLeftSubBtnLabel('50%');
        setMidRightSubBtnLabel('75%');
        setRightSubBtnLabel('100%');
        setSelectedSubtype(brightnessType);
        break;
      case 5:
        setLeftSubBtnLabel('3 sec');
        setMidLeftSubBtnLabel('5 sec');
        setMidRightSubBtnLabel('10 sec');
        setRightSubBtnLabel('OFF');
        setSelectedSubtype(timerType);
        break;
      default:
        break;
    }
  }
};

export default BottomView;

const styles = StyleSheet.create({
  flashActionView: {
    width: '80%',
    flexDirection: 'row',
    backgroundColor: ColorConstants.translucentGrey,
    borderWidth: 0.5,
    borderRadius: 20,
    marginRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderColor: ColorConstants.translucentGrey,
    justifyContent: 'space-evenly',
  },
  actionText: {
    color: ColorConstants.white,
    fontSize: 15,
    marginLeft: 10,
    marginRight: 10,
  },
  topActionContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10,
  },
  btnActionView: {
    width: 40,
    height: 40,
    backgroundColor: ColorConstants.lightBlck,
    borderRadius: 20,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
  },
  actionView: {
    position: 'absolute',
    bottom: 0,
    width: AppDimensions.window.width,
    height: AppDimensions.cameraactionAreaHeight,
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  galleryIcon: {
    width: 25,
    height: 25,
  },
  documentIcon: {width: 19, height: 23},
  flashIcon: {
    width: 15,
    height: 25,
  },
  birghtnessIcon: {
    width: 25,
    height: 25,
  },
  videorecordingIcon: {
    width: 20,
    height: 15,
  },
  gridIcon: {
    width: 20,
    height: 20,
  },
  timerIcon: {
    width: 20,
    height: 20,
  },
  bottomActionContainer: {
    marginTop: 30,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  placeHolderView: {
    width: 70,
    height: 70,
    backgroundColor: ColorConstants.translucentGrey,
    borderRadius: 10,
    borderColor: ColorConstants.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeHolderIcon: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  captureIcon: {
    width: 60,
    height: 60,
  },
  flipIcon: {
    width: 25,
    height: 25,
  },
  resolutionTitle: {
    color: 'black',
    fontSize: 18,
    fontWeight: '700',
  },
  resolutionDescription: {
    color: 'black',
    fontSize: 17,
    fontWeight: '300',
    marginTop: 15,
    marginBottom: 50,
  },
  cancelBtn: {
    width: '40%',
    paddingLeft: 20,
    paddingRight: 20,
    borderWidth: 0.5,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: ColorConstants.grey,
  },
  okBtn: {
    width: '40%',
    paddingLeft: 20,
    paddingRight: 20,
    borderWidth: 0.5,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ColorConstants.grey,
    borderColor: ColorConstants.grey,
    color: ColorConstants.white,
  },
  modalView: {
    bottom: -10,
    position: 'absolute',
    width: '100%',
    height: '30%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  btnView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
});
