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
  let error = useAppSelector(
    state => state.gallery.mediaInScript?.[question]?.[label]?.error,
  );

  const LANG = useAppSelector(state => state.lang.keyValues);

  let min = data.Min;
  let max = data.Max ? data.Max : 1000;

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
      <View style={styles.mediaHeader}>
        <Text style={styles.title}>{NAME(label)}</Text>
        <Text style={styles.minMax(error)}>
          min : {min} {max !== 1000 ? `max: ${max}` : ''}
        </Text>
      </View>
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
const MediaHolder = (props: MediaHolderProps) => {
  let {data, question, label} = props;
  let {ActivatedBy} = data;

  return ActivatedBy ? (
    <ActivateBy data={data} question={question} label={label} />
  ) : (
    <MediaInput data={data} question={question} label={label} />
  );
};

export default MediaHolder;

const styles = StyleSheet.create({
  mediaHolderWrap: {
    width: '100%',
    margin: 5,
  },
  mediaHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 16,
  },
  minMax: (val: boolean) => ({
    fontSize: 10,
    marginLeft: 20,
    borderWidth: 0.5,
    borderRadius: 3,
    padding: 2,
    color: val ? 'red' : 'green',
    borderColor: val ? 'red' : 'green',
  }),
  mediaHolder: {
    width: 100,
    height: 100,
    borderWidth: 0.4,
    borderRadius: 5,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    fontSize: 40,
    color: 'grey',
  },
});
