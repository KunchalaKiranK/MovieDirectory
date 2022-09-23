import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {getMediaLabelsByStation} from '../../utils/getMediaByStation';
import {useAppSelector} from '../../_app';
import MediaHolderAtSurvey from './MediaHolderAtSurvey';

const MediaLabelsAtSurvey = () => {
  const currentStation = useAppSelector(state => state.user.currentStation);
  const stationChanged = useAppSelector(state => state.user.stationChange);

  const [mediaData, setMediaData] = useState(() =>
    getMediaLabelsByStation(currentStation),
  );
  useEffect(() => {
    setMediaData(() => getMediaLabelsByStation(currentStation));
  }, [currentStation, stationChanged]);
  return (
    <View style={styles.mediaWrapper}>
      {Object.entries(mediaData)?.length > 0 ? (
        Object.entries(mediaData).map(item => {
          return Object.entries(item[1]).map((img: any) => {
            return (
              <MediaHolderAtSurvey
                key={img[0]}
                data={img[1].media}
                question={item[0]}
                label={img[0]}
              />
            );
          });
        })
      ) : (
        <Text>No media labels are found</Text>
      )}
    </View>
  );
};

export default MediaLabelsAtSurvey;

const styles = StyleSheet.create({
  mediaWrapper: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#fff',
    marginBottom: 60,
  },
});
