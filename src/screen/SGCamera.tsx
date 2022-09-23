import React, {useRef, useState, useEffect, useCallback} from 'react';
import {StyleSheet, View, Platform, Text} from 'react-native';
import {
  Camera,
  CameraCaptureError,
  CameraRuntimeError,
  useCameraDevices,
} from 'react-native-vision-camera';
import RNFS from 'react-native-fs';
import {useNavigation} from '@react-navigation/native';

import {useAppDispatch, useAppSelector} from '../_app';
import {updateLocalMedia} from '../_feature';
import AppDimensions from '../utils/AppDimensions';
import ColorConstants from '../utils/ColorConstants';
import {
  BottomActionContainer,
  BottomView,
  GridView,
  LabelView,
  TopView,
} from '../component';

const SGCamera = () => {
  const devices = useCameraDevices();
  const device = devices.back;
  const camera = useRef<Camera>(null);

  const orderNumber = useAppSelector(state => state.user.orderNumber);

  const [capturedImage, setCaptutredImage] = useState('');
  const [hideBack, setHideBack] = useState(false);
  const [cameraHeight, setCameraHeight] = useState(
    AppDimensions.window.height -
      (AppDimensions.appHeaderHeight + AppDimensions.cameraactionAreaHeight),
  );

  const navigation = useNavigation<any>();
  const [pics, setPics] = useState([]);
  const [gridStatus, setGridStatus] = useState(false);
  const [torchStatus, setTorchStatus] = useState<any>('off');
  const [backCamera, setCameraType] = useState(true);
  console.log('kkjnk', backCamera);
  const [isPhoto, setMediaType] = useState(true);
  const [isRecording, setVideoRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState('0:0:0');
  const [fromTimer, setFromTimer] = useState(false);
  var interval: any;
  var hour = 0;
  var minute = 0;
  var seconds = 0;
  const dispatch = useAppDispatch();

  useEffect(() => {
    handleCameraPermission();
    verifyDirectory();
  }, []);

  useEffect(() => {
    console.log('bbmn');
  }, [true]);

  useEffect(() => {
    if (isRecording && !fromTimer) {
      const interval = setInterval(() => {
        seconds = seconds + 1;
        if (seconds === 60) {
          seconds = 0;
          minute = minute + 1;
        }
        if (minute === 60) {
          seconds = 0;
          minute = 0;
          hour = hour + 1;
        }
        setRecordingTime(`${hour}:${minute}:${seconds}`);
        if (minute === 3) {
          clearInterval(interval);
          stopVideoRecording();
        }
      }, 1000);
      return () => clearInterval(interval);
    } else {
    }
  }, [isRecording]);

  const timer30s = () => {
    setFromTimer(true);
    if (!isRecording) {
      handleVideoRecording();
      const interval = setInterval(() => {
        seconds = seconds + 1;
        if (seconds === 60) {
          seconds = 0;
          minute = minute + 1;
        }
        if (minute === 60) {
          seconds = 0;
          minute = 0;
          hour = hour + 1;
        }
        setRecordingTime(`${hour}:${minute}:${seconds}`);
        if (seconds === 30) {
          clearInterval(interval);
          stopVideoRecording();
          setFromTimer(false);
          return () => clearInterval(interval);
        }
      }, 1000);
    }
  };

  async function verifyDirectory() {
    console.log('====================================');
    console.log(orderNumber);
    console.log('====================================');
    let exists = await RNFS.exists(
      RNFS.DocumentDirectoryPath + '/com.safegurad/' + orderNumber,
    );
    if (!exists) {
      RNFS.mkdir(RNFS.DocumentDirectoryPath + '/com.safegurad/' + orderNumber);
    }
  }

  const handleCameraPermission = async () => {
    const cameraPermission = await Camera.getCameraPermissionStatus();
    if (cameraPermission === 'denied') {
      const newCameraPermission = await Camera.requestCameraPermission();
    }
    const microphonePermission = await Camera.getMicrophonePermissionStatus();
    if (microphonePermission === 'denied') {
      const newMicrophonePermission =
        await Camera.requestMicrophonePermission();
    }
  };

  const stopVideoRecording = async () => {
    setRecordingTime('0:0:0');
    clearInterval(interval);
    try {
      await camera.current.stopRecording();
      setVideoRecording(false);
    } catch (e) {}
  };

  const handleMediaType = () => {
    setMediaType(!isPhoto);
  };

  const handleVideoRecording = useCallback(async () => {
    setRecordingTime('0:0:0');
    setVideoRecording(true);
    clearInterval(interval);
    try {
      camera.current.startRecording({
        flash: 'on',
        onRecordingFinished: video => {
          const oldFilePath = video.path;
          console.log(oldFilePath);
          var videoId = Date.now().toString();
          var newFilePath = '';
          newFilePath = `${RNFS.DocumentDirectoryPath}/com.safegurad/${orderNumber}/video${videoId}.mp4`;

          RNFS.moveFile(oldFilePath, newFilePath)
            .then(() => {
              dispatch(
                updateLocalMedia({
                  id: videoId,
                  orderNumber: orderNumber,
                  uploadStatus: false,
                  path: '' + newFilePath,
                  fileType: 'mp4',
                  platform: Platform.OS,
                }),
              );
              let data = pics;
              data.push(newFilePath);
              setPics(() => [...data]);
            })
            .catch(error => {
              console.log(error);
            });
        },
        onRecordingError: error => console.error(error),
      });
    } catch (e) {}
  }, [camera]);

  const handleImageCapture = useCallback(async () => {
    try {
      const photo = await camera.current.takePhoto();
      const oldFilePath = `file://${photo.path}`;
      var imageId = Date.now().toString();
      var newFilePath = '';
      newFilePath = `${RNFS.DocumentDirectoryPath}/com.safegurad/${orderNumber}/pic1${imageId}.jpg`;

      RNFS.moveFile(oldFilePath, newFilePath)
        .then(() => {
          dispatch(
            updateLocalMedia({
              id: imageId,
              orderNumber: orderNumber,
              uploadStatus: false,
              path: '' + newFilePath,
              fileType: 'jpg',
              platform: Platform.OS,
            }),
          );
          setCaptutredImage(newFilePath);
        })
        .catch(error => {
          console.log(error);
        });
    } catch (e) {
      if (e instanceof CameraCaptureError) {
        switch (e.code) {
          case 'capture/file-io-error':
            console.error('Failed to write photo to disk!');
            break;
          default:
            console.error(e);
            break;
        }
      }
    }
  }, [camera]);

  const onError = useCallback((error: CameraRuntimeError) => {
    switch (error.code) {
      case 'device/configuration-error':
        console.error(error);
        break;
      case 'device/microphone-unavailable':
        Camera.requestMicrophonePermission();
        break;
      default:
        console.error(error);
        break;
    }
  }, []);

  const onClickCameraActionButton = (btnType: any) => {
    console.log('Click On Gallery', btnType);
    switch (btnType) {
      case 1:
        break;
      case 2:
        break;
      case 3:
        setHideBack(!hideBack);
        if (!hideBack) {
          setCameraHeight(
            AppDimensions.window.height - AppDimensions.appHeaderHeight,
          );
        } else {
          setTimeout(() => {
            setCameraHeight(
              AppDimensions.window.height -
                (AppDimensions.appHeaderHeight +
                  AppDimensions.cameraactionAreaHeight),
            );
          }, 500);
        }
        break;
      case 4:
        setGridStatus(!gridStatus);
        break;
      case 6:
        handleImageCapture();
        break;
      case 7:
        setCameraType(!backCamera);
        break;
      case 8:
        navigation.navigate('Gallery', {orderNumber: orderNumber});
        break;
      default:
        break;
    }
  };

  if (device == null)
    return (
      <View>
        <Text>Camera not supported</Text>
      </View>
    );
  return (
    <View style={styles.container}>
      <View style={styles.headerView}></View>
      <Camera
        style={[
          styles.cameraPreview,
          {
            height: cameraHeight,
          },
        ]}
        device={backCamera ? devices.back : devices.front}
        onError={onError}
        isActive={true}
        ref={camera}
        photo={true}
        orientation="portrait"
        hasFlash={true}
        torch={torchStatus}
        video={true}
        audio={true} // <-- optional
      />
      {gridStatus ? <GridView /> : null}
      <TopView />
      <LabelView />
      <BottomActionContainer clickHideBack={hideBack} />
      <BottomView
        onClick={onClickCameraActionButton}
        capturedImageUri={capturedImage}
      />
    </View>
  );
};

export default SGCamera;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  headerView: {
    width: AppDimensions.window.width,
    height: AppDimensions.appHeaderHeight,
    backgroundColor: ColorConstants.black,
  },
  cameraPreview: {
    width: AppDimensions.window.width,
  },
});
