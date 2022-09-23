import React, {useEffect, useState} from 'react';
// import {useNavigate, useParams} from 'react-router-dom';
import {TYPE} from 'safeguard-corescript-npm';
import {useNavigation} from '@react-navigation/native';
import {Image, StyleSheet, Text, TouchableOpacity} from 'react-native';

import {useAppDispatch, useAppSelector} from '../../_app';
import {activatedByCheck} from '../../utils';
import {updateBottomSheetStatus} from '../../_feature';
import {transport} from '../../utils/transport';
import {ErrorIcon, GreenCheck} from '../../assets';

const StationHOC = (props: TYPE.RenderStationProps) => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const {ActivatedBy, Name} = props;

  // get the data from store
  const currentOrder = useAppSelector(state => state.user.orderNumber);
  const LANGPACK = useAppSelector(state => state.lang.keyValues);
  const Question = useAppSelector(state => state.script.survey.questions);
  const STATION_DATA = useAppSelector(state => state.script.survey.stationData);

  let NAME = LANGPACK[Name] ? LANGPACK[Name] : Name;

  const [activate, setActivate] = useState<boolean>(false);

  useEffect(() => {
    if (ActivatedBy) {
      let val = activatedByCheck(ActivatedBy, currentOrder, 'survay');
      if (activate !== val) {
        setActivate(val);
      }
    }
  }, [Question]);

  // get status of station
  // false - if we have some error
  // true if we don't have any error
  const getStationStatus = (stationName: string) => {
    if (stationName) {
      let {error, mediaError} = transport('survey', {
        [stationName]: STATION_DATA[stationName],
      });
      if (error === true || mediaError.length > 0) {
        return false;
      }
    }
    return true;
  };
  // handle navigation on station click
  const handleNavigation = (station: string) => {
    if (STATION_DATA[station]) {
      navigation.navigate('Question', {station});
      dispatch(updateBottomSheetStatus({status: false, type: 'station'}));
    } else {
      navigation.navigate('Station');
    }
  };

  return ActivatedBy && activate ? (
    <TouchableOpacity
      style={styles.stationTextWrap}
      onPress={() => {
        handleNavigation(Name);
      }}>
      <Text style={styles.stationText}>{NAME}</Text>
      {getStationStatus(Name) ? (
        <Image style={styles.greenCheckIcon} source={GreenCheck} />
      ) : (
        <Image style={styles.errorIcon} source={ErrorIcon} />
      )}
    </TouchableOpacity>
  ) : null;
};

export default StationHOC;
const styles = StyleSheet.create({
  stationTextWrap: {
    paddingLeft: 40,
    padding: 10,
    flexDirection: 'row',
  },
  stationText: {
    color: 'grey',
    fontSize: 16,
    fontWeight: 'bold',
  },
  greenCheckIcon: {
    height: 25,
    width: 25,
    marginLeft: 10,
  },
  errorIcon: {
    height: 16,
    width: 16,
    marginLeft: 10,
  },
});
