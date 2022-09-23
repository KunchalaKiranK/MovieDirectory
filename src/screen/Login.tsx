import React, {useState} from 'react';
import {Buffer} from 'buffer';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';

import {useAppDispatch, useAppSelector} from '../_app';
import {
  updateFilterListInitialState,
  updateLangIntialState,
  updateLoadingStateOfUser,
  updateOrderListInitialState,
  updateUserIntialState,
} from '../_feature';
import {
  _getLanguagePack,
  _getOrderList,
  _pullDownToDownloadOrder,
} from '../_service';
import {returnFilterList} from '../utils/reUsables';

import {OrderListProp} from '../_feature/orderLists';
import {FilterListProp} from '../_feature/filtertList';
import {ScrollView} from 'react-native-gesture-handler';

const Login = () => {
  const dispatch = useAppDispatch();

  const loadingStatus = useAppSelector(state => state.user.loading);

  const [userName, setUserName] = useState('TAAZAA');
  const [userPassword, setUserPassword] = useState('Password1');
  const [isEnabled, setIsEnabled] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState(loadingStatus);

  const performLogin = () => {
    setLoading(true);
    dispatch(updateLoadingStateOfUser(true));
    // Get all required data from APIs
    const url = 'https://vndapi2.sgpdev.com/SetCookie';

    // Refactor note: /setcookie should probably be made a POST
    const base =
      'Basic ' + Buffer.from(userName + ':' + userPassword).toString('base64');
    fetch(url, {
      mode: 'cors',
      method: 'POST',
      credentials: 'include',
      headers: {authorization: base},
    })
      .then(response => {
        return response;
      })
      .then(() => {
        dispatch(updateUserIntialState({user: userName}));
        dispatch(updateLoadingStateOfUser(false));

        _getOrderList()
          .then(res => {
            // System were data is originating. This will be expanded later.
            const SOURCE_SYSTEM = 'INSPI';
            // Default language
            const LANG_EN = 'EN';

            // get language
            _getLanguagePack(LANG_EN, SOURCE_SYSTEM).then(data => {
              dispatch(updateLangIntialState(data));
            });
            let orderListData: OrderListProp[] = res.data.items;
            dispatch(updateOrderListInitialState(orderListData));
            let filterListData: FilterListProp[] =
              returnFilterList(orderListData);
            dispatch(updateFilterListInitialState(filterListData));
            if (isEnabled) {
              _pullDownToDownloadOrder(orderListData);
            }
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      });
  };

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const CustomCheckBox = () => (
    <CheckBox
      value={isEnabled}
      onValueChange={toggleSwitch}
      onCheckColor={'#939598'}
    />
  );

  const LoginHeader = () => {
    return (
      <View style={styles.login_header}>
        <Text style={styles.hello_text}>Hello!</Text>
        <Text style={styles.welcome_text}>
          Welcome Back to Safeguard Mobile
        </Text>
      </View>
    );
  };

  const LoginBody = () => {
    return (
      <View style={styles.login_body}>
        <View style={styles.input_container}>
          <Text style={styles.inputLabel}>Username</Text>
          <TextInput
            onChangeText={value => {
              setUserName(value);
            }}
            placeholder="Enter User Name"
            style={styles.input}
            value={userName}
          />
        </View>
        <View style={styles.input_container}>
          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            onChangeText={value => setUserPassword(value)}
            placeholder="Enter Password"
            style={styles.input}
            defaultValue={userPassword}
            secureTextEntry={!showPassword}
          />
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            style={styles.show_password}>
            {showPassword ? (
              <Image
                style={styles.eye}
                source={require('../assets/images/hide.png')}
              />
            ) : (
              <Image
                style={styles.eye}
                source={require('../assets/images/show.png')}
              />
            )}
          </Pressable>
        </View>
        <View style={styles.remember_forget_container}>
          <View style={styles.checkbox_container}>
            <CheckBox value={false} onCheckColor={'#939598'} />
            <Text style={styles.text1}>Remember Me?</Text>
          </View>
          <View>
            <Pressable>
              <Text>Forgot Password?</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  const LoginFooter = () => {
    return (
      <View style={styles.login_footer}>
        <View style={styles.checkbox_container}>
          <CustomCheckBox />
          <Text style={styles.text1}>Download Orders When Logging In</Text>
        </View>
        <Pressable style={styles.login_button} onPress={performLogin}>
          <Text style={styles.login_text}>Login</Text>
        </Pressable>
        <View style={styles.checkbox_container}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Text style={styles.textLink}>Privacy Policy</Text>
            <Text style={styles.text1}>and </Text>
            <Text style={styles.textLink}>Terms of use</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.top}>
        <LoginHeader />
        <LoginBody />
      </View>
      <LoginFooter />
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      )}
    </ScrollView>
  );
};
export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  top: {
    width: '100%',
  },
  login_header: {
    width: '100%',
  },
  hello_text: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
  },
  welcome_text: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 30,
    color: '#585859',
  },
  login_body: {
    marginTop: 12,
  },
  input_container: {
    marginTop: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#2C2C2C',
  },
  input: {
    height: 48,
    borderWidth: 0.5,
    borderColor: '#939598',
    borderRadius: 3,
    color: '#585859',
    padding: 10,
    marginTop: 8,
  },
  remember_forget_container: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkbox_container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
  },
  login_footer: {
    width: '100%',
  },
  login_button: {
    width: '100%',
    backgroundColor: '#939598',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  login_text: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  signup_container: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  show_password: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    height: 48,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text1: {
    color: '#939598',
    marginLeft: 5,
    marginRight: 5,
  },
  textLink: {
    color: '#939598',
    textDecorationLine: 'underline',
  },
  textLinkBold: {
    color: '#939598',
    fontWeight: 'bold',
  },
  custom_checkbox: {
    width: 15,
    height: 15,
    borderWidth: 1,
    borderColor: '#939598',
    position: 'relative',
    marginRight: 10,
  },
  eye: {
    width: 20,
    height: 20,
  },
  loading: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.05)',
  },
});
