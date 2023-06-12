import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import 'text-encoding-polyfill';
import InputField from './InputField';
import colors from '../extensions/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Errors from './Errors';
import MainButton from '../extensions/MainButton';
import Feather from 'react-native-vector-icons/Feather';
import {connect} from 'react-redux';
import {setLoading, setUser, setTrackedOrders} from '../../redux/Reducers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import api from '../extensions/Api';
import KeyboardView from '../extensions/KeyboardView';

function mapDispatchToProps(dispatch) {
  return {
    setLoading: (opened, done) => dispatch(setLoading(opened, done)),
    setUser: user => dispatch(setUser(user)),
    setTrackedOrders: trackedOrders =>
      dispatch(setTrackedOrders(trackedOrders)),
  };
}

const windowWidth = Dimensions.get('window').width;

function SignIn({setLoading, setUser, setTrackedOrders}) {
  const navigation = useNavigation();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const passwordRef = useRef();

  const [errors, setErrors] = useState([]);

  async function handleEnter() {
    const cleanedPhone = '+7' + phone.replace(/[-() ]/g, '');
    Keyboard.dismiss();
    setLoading(true, false);
    setErrors([]);

    try {
      const response = await axios.post(api.clients.sign_in, {
        phone: cleanedPhone,
        password: password,
      });
      await AsyncStorage.setItem('authToken', response.headers['x-auth-token']);
      setUser({
        ...response.data.client,
        authToken: response.headers['x-auth-token'],
      });
      setTrackedOrders(response.data.orders);
      navigation.popToTop();
    } catch (error) {
      setErrors([
        {
          message: error.response ? error.response.data : error.message,
        },
      ]);
    }
    setLoading(true, true);
  }

  function handleRecoveryPassword() {
    navigation.navigate('SendSms', {
      recoveryPassword: true,
    });
  }

  return (
    <KeyboardView>
      <Text style={styles.signIn__title}>Введите номер телефона и пароль</Text>
      <View style={styles.signIn__inputFieldBox}>
        <InputField
          input={phone}
          setInput={setPhone}
          autoFocus={true}
          forPhone={true}
          icon={<Feather name="phone" size={30} color="grey" />}
        />

        <InputField
          inputRef={passwordRef}
          input={password}
          setInput={setPassword}
          placeholder={'Пароль'}
          returnKey={'go'}
          maxLength={50}
          secureTextEntry={true}
          submit={handleEnter}
          icon={<Ionicons name="lock-closed-outline" size={30} color="grey" />}
        />
      </View>

      <Text style={styles.sms__subTitle}>
        Забыли пароль?{' '}
        <TouchableOpacity onPress={handleRecoveryPassword}>
          <Text style={styles.sms__smsTitle}>Восстановить</Text>
        </TouchableOpacity>
      </Text>

      <Errors errors={errors} />
      <MainButton
        title="Войти"
        handlePress={handleEnter}
        disabled={phone.length === 15 && password.length > 0 ? false : true}
        marginTop={30}
      />
    </KeyboardView>
  );
}

const styles = StyleSheet.create({
  signIn: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },

  signIn__title: {
    alignSelf: 'center',
    color: 'black',
    fontSize: 25,
    width: windowWidth - 30,
    marginTop: 30,
    marginBottom: 30,
  },

  signIn__inputFieldBox: {
    backgroundColor: 'white',
    borderWidth: 0.2,
    borderColor: 'grey',
  },

  sms__subTitle: {
    alignSelf: 'center',
    marginTop: 15,
    width: windowWidth - 30,
    color: 'grey',
  },

  sms__smsTitle: {
    color: colors.blue,
    textDecorationLine: 'underline',
    bottom: -3,
  },
});

export default connect(null, mapDispatchToProps)(SignIn);
