import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {MediaHolder} from '../component';

import {useAppSelector} from '../_app';

const MediaLabels = () => {
  const galleryStatus = useAppSelector(state => state.gallery.open);
  const IMAGES = useAppSelector(state => state.gallery.mediaInScript);
  const currentQuestion = useAppSelector(
    state => state.gallery.currentQuestionName,
  );

  const [options, setOptions] = useState<string>('');
  const [mediaData, setMediaData] = useState(() => IMAGES);

  useEffect(() => {
    setOptions('all');
  }, []);

  // update all media file
  useEffect(() => {
    if (options === 'all') {
      setMediaData(() => IMAGES);
    }
  }, [IMAGES, options]);

  // update question based media
  useEffect(() => {
    if (options === 'by question') {
      if (IMAGES[currentQuestion]) {
        setMediaData(() => ({
          [currentQuestion]: IMAGES[currentQuestion],
        }));
      }
    }
  }, [IMAGES, currentQuestion, options]);

  return (
    <ScrollView style={styles.mediaWrapper}>
      {Object.entries(mediaData)?.length > 0 ? (
        Object.entries(mediaData).map(item => {
          return Object.entries(item[1]).map((img: any) => {
            return (
              <MediaHolder
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
    </ScrollView>
  );
};

export default MediaLabels;

const styles = StyleSheet.create({
  mediaWrapper: {
    flex: 1,
    flexDirection: 'column',
    margin: 10,
    marginBottom: 40,
  },
});
