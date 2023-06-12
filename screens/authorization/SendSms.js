import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Dimensions, Keyboard} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InputField from './InputField';
import Feather from 'react-native-vector-icons/Feather';
import MainButton from '../extensions/MainButton';
import {useNavigation, useRoute} from '@react-navigation/native';
import {connect} from 'react-redux';
import {setLoading} from '../../redux/Reducers';
import axios from 'axios';
import moment from 'moment';
import Errors from './Errors';
import api from '../extensions/Api';
import KeyboardView from '../extensions/KeyboardView';

function mapDispatchToProps(dispatch) {
  return {
    setLoading: (opened, done) => dispatch(setLoading(opened, done)),
  };
}

const windowWidth = Dimensions.get('window').width;

function SendSms({setLoading}) {
  const navigation = useNavigation();
  const [phone, setPhone] = useState('');
  const [expire, setExpire] = useState(0);
  const [errors, setErrors] = useState([]);

  const {params} = useRoute();

  async function handleSentSMS() {
    const cleanedPhone = '+7' + phone.replace(/[-() ]/g, '');
    Keyboard.dismiss();
    setLoading(true, false);
    try {
      const response = await axios.post(
        params.recoveryPassword
          ? api.clients.send_sms_for_recovery_password
          : api.clients.send_sms,
        {phone: cleanedPhone},
      );
      await AsyncStorage.setItem('sendCodeTime', response.data.expire);
      navigation.navigate('VerifySms', {
        phone: cleanedPhone,
        smsIdToken: response.headers['x-sms-id-token'],
        recoveryPassword: params.recoveryPassword,
      });
      setExpire(60);
    } catch (error) {
      setErrors([
        {
          message: error.response ? error.response.data : error.message,
        },
      ]);
    }
    setLoading(true, true);
    // setErrors([
    //   {
    //     message: `Доступен только Казахстанский номер телефона.`,
    //   },
    // ]);
  }

  useEffect(() => {
    if (expire < 0) return;
    const intervalId = setInterval(() => {
      setExpire(expire - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [expire]);

  useEffect(() => {
    AsyncStorage.getItem('sendCodeTime').then(date => {
      if (date !== null) {
        const now = moment(new Date());
        const late = moment(date);
        const seconds = late.diff(now, 'seconds');
        setExpire(seconds);
      }
    });
  }, []);

  return (
    <KeyboardView>
      <Text style={styles.sendSms__title}>Введите свой номер телефона</Text>
      <View style={styles.sendSms__container}>
        <InputField
          input={phone}
          setInput={setPhone}
          autoFocus={true}
          forPhone={true}
          icon={<Feather name="phone" size={30} color="grey" />}
        />
      </View>
      <Text style={styles.sendSms__subTitle}>
        Вам будет отправилен смс-код для подтверждение личности.
      </Text>
      {expire > 0 && (
        <Text style={styles.sendSms__subTitle}>
          Повторная отправка достпуна через{' '}
          <Text style={{color: 'black'}}>{expire}</Text>
        </Text>
      )}

      <Errors errors={errors} />

      <MainButton
        title={'Отправить смс'}
        handlePress={handleSentSMS}
        disabled={phone.length === 15 && expire < 1 ? false : true}
        marginTop={30}
      />
    </KeyboardView>
  );
}

const styles = StyleSheet.create({
  sendSms: {
    flex: 1,
  },

  sendSms__title: {
    alignSelf: 'center',
    color: 'black',
    fontSize: 25,
    width: windowWidth - 30,
    marginTop: 30,
    marginBottom: 30,
  },

  sendSms__subTitle: {
    alignSelf: 'center',
    color: 'grey',
    width: windowWidth - 30,
    marginTop: 15,
  },

  sendSms__container: {
    backgroundColor: 'white',
    borderWidth: 0.2,
    borderColor: 'grey',
  },
});

export default connect(null, mapDispatchToProps)(SendSms);
