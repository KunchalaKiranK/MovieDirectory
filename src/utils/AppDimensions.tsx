import {Dimensions} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default {
  window: {
    width: windowWidth,
    height: windowHeight,
  },
  appHeaderHeight: 50,
  cameraactionAreaHeight: windowHeight / 5 + 40,
  _5: 5,
  _10: 10,
  _15: 15,
  _20: 20,
  _25: 25,
  _30: 30,
  _35: 35,
  _40: 40,
  _45: 45,
  _50: 50,
  _55: 55,
  _60: 60,
};
