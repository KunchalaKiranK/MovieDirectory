import React from 'react';
import {Text, View} from 'react-native';

import StringsConstants from '../../utils/StringsConstants';

const NoCameraPreview = () => {
  return (
    <View>
      <Text>{StringsConstants.NO_CAMERA_PREVIEW}</Text>
    </View>
  );
};

export default NoCameraPreview;
