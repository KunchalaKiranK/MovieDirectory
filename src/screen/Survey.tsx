import React from 'react';
import {renderStations, TYPE} from 'safeguard-corescript-npm';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {useAppDispatch, useAppSelector} from '../_app';
import {StationHOC} from '../component';
import {updateBottomSheetStatus} from '../_feature';
import {ErrorIcon, GreenCheck} from '../assets';
import {transport} from '../utils/transport';

const Survey = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  // get the data from store
  const RAW_DATA = useAppSelector(state => state.script.survey.station);
  const LANGPACK = useAppSelector(state => state.lang.keyValues);
  const STATION_DATA = useAppSelector(state => state.script.survey.stationData);

  // handle navigation on station click
  const handleNavigation = (station: string) => {
    if (STATION_DATA[station]) {
      navigation.navigate('Question', {station});
      dispatch(updateBottomSheetStatus({status: false, type: 'station'}));
    } else {
      navigation.navigate('OrderDetail');
    }
  };

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

  // station list components
  const StationList = (props: TYPE.RenderStationProps) => {
    const {Name} = props;
    let NAME = LANGPACK[Name] ? LANGPACK[Name] : Name;

    return (
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
    );
  };

  if (RAW_DATA === undefined) return <Text>Loading</Text>;
  return (
    <View style={styles.container}>
      <ScrollView>
        {RAW_DATA.map((item: any) => {
          return renderStations(item) || item?.ActivatedBy ? (
            item.ActivatedBy ? (
              <StationHOC key={item?.Name} {...item} />
            ) : null
          ) : (
            <StationList key={item?.Name} {...item} />
          );
        })}
      </ScrollView>
    </View>
  );
};
export default Survey;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: '#fff',
  },
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
