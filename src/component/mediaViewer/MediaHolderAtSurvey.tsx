import React, {useState, useEffect, useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {activatedByCheck} from '../../utils';
import {useAppDispatch, useAppSelector} from '../../_app';
import {
  removeMedia,
  updateMediaErrorInScript,
  updateMediaInScriptResponse,
  updateMediaLabelModal,
} from '../../_feature';

interface MediaHolderProps {
  data: any;
  question: string;
  label: string;
}

// render img placeholder
const MediaInput = (props: MediaHolderProps) => {
  let {data, question, label} = props;

  const dispatch = useAppDispatch();

  let labelSrcs = useAppSelector(state => state.gallery.mediaInScript)[
    question
  ];

  const LANG = useAppSelector(state => state.lang.keyValues);

  let min = data.Min;

  const [srcs, setSrcs] = useState<any[]>(() =>
    labelSrcs ? labelSrcs[label]?.response : [],
  );

  // map the key with language pack
  const NAME = (name: string) => (LANG[name] ? LANG[name] : name);

  // update media
  useEffect(() => {
    setSrcs(() =>
      labelSrcs?.[label]?.response ? labelSrcs?.[label]?.response : [],
    );
  }, [labelSrcs]);

  // update Error
  useEffect(() => {
    if (min > srcs.length) {
      dispatch(
        updateMediaErrorInScript({
          question,
          label,
          err: true,
        }),
      );
    }
  }, [srcs, labelSrcs]);

  return (
    <View style={styles.mediaHolderWrap}>
      <View style={styles.mediaHolder}>
        {srcs.length > 0 ? (
          <View>
            {srcs.map(link => {
              return (
                <Text key={link.imageId}>
                  {'https://sbimage.sgpdev.com/' +
                    link.webFileName.replace(/.([^.]*)$/, '_TN.$1')}
                </Text>
              );
            })}
          </View>
        ) : (
          <Text style={styles.placeholder}>+</Text>
        )}
      </View>
      <View style={styles.mediaHeader}>
        <Text style={styles.title}>{NAME(label)}</Text>
      </View>
    </View>
  );
};

// handle the status of activatedBy
const ActivateBy = (props: MediaHolderProps) => {
  const {data, question, label} = props;
  const {ActivatedBy} = data;

  // get data from store
  const Question = useAppSelector(state => state.script.survey.questions);

  const activated = useMemo(
    () => activatedByCheck(ActivatedBy, 'survey'),
    [Question],
  );

  return activated ? (
    <MediaInput data={data} question={question} label={label} />
  ) : null;
};

// handle img props if it have activatedBy keys or not
const MediaHolderAtSurvey = (props: MediaHolderProps) => {
  let {data, question, label} = props;
  let {ActivatedBy} = data;

  return ActivatedBy ? (
    <ActivateBy data={data} question={question} label={label} />
  ) : (
    <MediaInput data={data} question={question} label={label} />
  );
};

export default MediaHolderAtSurvey;

const styles = StyleSheet.create({
  mediaHolderWrap: {
    maxWidth: 100,
    height: 80,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaHeader: {
    maxWidth: 100,
    overflow: 'hidden',
    height: 20,
  },
  title: {
    fontSize: 14,
  },
  mediaHolder: {
    width: 60,
    height: 60,
    borderWidth: 0.4,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00f1',
  },
  placeholder: {
    fontSize: 40,
    color: 'grey',
  },
});
