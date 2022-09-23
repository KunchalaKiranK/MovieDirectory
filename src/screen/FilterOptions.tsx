import React, {useEffect, useState} from 'react';
import {Platform, Pressable, StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import DropDownPicker from 'react-native-dropdown-picker';
import {ORDER_STATUS} from '../utils';
import {isAppliedFilterExist} from '../utils/reUsables';

const FilterOptions = props => {
  const FILTER_LIST = useSelector((state: any) => state.filterList.filterList);
  const [options, setOptions] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const {navigation} = props;
  const {setAppliedFilters, appliedFilters} = props.route.params;

  const isAndroid = Platform.OS === 'android';

  const handleSelectededFilters = () => {
    setAppliedFilters(selectedFilters);
    navigation.navigate('Orders');
  };

  const loadOptions = () => {
    const tempOptions: any = {};
    for (let key in FILTER_LIST) {
      tempOptions[key] = FILTER_LIST[key].map((item: string) => {
        let label;
        if (key === 'types') label = item.split('_')[1];
        else if (key === 'progressStatuses') label = ORDER_STATUS[item].key;
        else label = item;
        return {
          value: item,
          label,
        };
      });
    }
    setOptions(tempOptions);
  };

  const geInitialSelectedFilters = () => {
    Object.keys(appliedFilters).forEach(key => {
      selectedFilters[key] = appliedFilters[key].map(item => item.value);
    });
  };

  useEffect(() => {
    loadOptions();
    geInitialSelectedFilters();
  }, []);

  const FilterListHeader = ({}) => {
    return (
      <View style={styles.filter_footer}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text>Back</Text>
        </Pressable>
        <Pressable onPress={() => setSelectedFilters({})}>
          <Text>Reset</Text>
        </Pressable>
      </View>
    );
  };

  const FilterListBody = () => {
    const DropDown = ({i, item}) => {
      const [open, setOpen] = useState(false);
      const [value, setValue] = useState(selectedFilters[item] || []);

      useEffect(() => {
        if (!isAppliedFilterExist(selectedFilters) && !value.length) return;
        selectedFilters[item] = value.map(e => {
          return {value: e};
        });
      }, [value]);

      return (
        <View style={!isAndroid && {zIndex: 200 - i}}>
          <Text>{item}</Text>
          <DropDownPicker
            open={open}
            setOpen={setOpen}
            value={value}
            items={options[item]}
            setValue={setValue}
            multiple={true}
            mode="BADGE"
            zIndex={200 - i}
          />
        </View>
      );
    };

    return (
      <View style={{minHeight: '80%'}}>
        {/* //temporarily filtering away tags and assignments */}
        {Object.keys(options)
          .filter(ele => ele !== 'tags' && ele !== 'assignments')
          .map((item, i) => (
            <DropDown i={i} item={item} key={item} />
          ))}
      </View>
    );
  };

  const FilterListFooter = () => {
    return (
      <View style={styles.filter_footer}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text>Cancel</Text>
        </Pressable>
        <Pressable onPress={handleSelectededFilters}>
          <Text>Apply</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.filter_container}>
      <FilterListHeader />
      <FilterListBody />
      <FilterListFooter />
    </View>
  );
};

export default FilterOptions;

const styles = StyleSheet.create({
  filter_container: {
    padding: 15,
  },
  filter_footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
