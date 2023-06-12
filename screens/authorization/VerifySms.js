import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import MainButton from '../extensions/MainButton';
import {useNavigation, useRoute} from '@react-navigation/native';
import colors from '../extensions/Colors';
import Errors from './Errors';
import {connect} from 'react-redux';
import {setLoading} from '../../redux/Reducers';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../extensions/Api';
import KeyboardView from '../extensions/KeyboardView';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

function mapDispatchToProps(dispatch) {
  return {
    setLoading: (opened, done) => dispatch(setLoading(opened, done)),
  };
}

const windowWidth = Dimensions.get('window').width;
const CELL_COUNT = 6;
const TEXT_INPUT_SIZE = windowWidth / CELL_COUNT - 15;

function VerifySms({setLoading}) {
  const navigation = useNavigation();
  const {params} = useRoute();
  const [smsIdToken, setSmsIdToken] = useState(params.smsIdToken);

  const [expire, setExpire] = useState(60);

  const [errors, setErrors] = useState([]);
  const [disabled, setDisabled] = useState(true);

  const [value, setValue] = useState('');
  const inputRef = useBlurOnFulfill({value: value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  async function handleVerifySms() {
    Keyboard.dismiss();
    setLoading(true, false);
    setErrors([]);
    try {
      await axios.post(
        params.recoveryPassword
          ? api.clients.verify_sms_for_recovery_password
          : api.clients.verify_sms,
        {
          phone: params.phone,
          smsCode: value,
        },
        {
          headers: {'x-sms-id-token': smsIdToken},
        },
      );
      navigation.navigate(
        params.recoveryPassword ? 'RecoveryPassword' : 'SignUp',
        {
          phone: params.phone,
          smsCode: value,
          smsIdToken: smsIdToken,
        },
      );
    } catch (error) {
      setErrors([
        {
          message: error.response ? error.response.data : error.message,
        },
      ]);
    }
    setLoading(true, true);
  }

  async function handleSendSmsAgain() {
    Keyboard.dismiss();
    setLoading(true, false);

    try {
      const response = await axios.post(api.clients.send_sms, {
        phone: params.phone,
      });

      await AsyncStorage.setItem('sendCodeTime', response.data.expire);
      setSmsIdToken(response.headers['x-sms-id-token']);

      setExpire(60);
    } catch (error) {
      setErrors([
        {
          message: error.response ? error.response.data : error.message,
        },
      ]);
    }

    setLoading(true, true);
  }

  useEffect(() => {
    if (value.length < 6) {
      setDisabled(true);
    } else {
      if (errors.length === 0) {
        handleVerifySms();
      }
      setDisabled(false);
    }
  }, [value]);

  useEffect(() => {
    if (expire < 0) return;
    const intervalId = setInterval(() => {
      setExpire(expire - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [expire]);

  return (
    <KeyboardView>
      <Text style={styles.verifySms__title}>Введите отправленный смс-код</Text>

      <CodeField
        ref={inputRef}
        rootStyle={styles.verifySms__input}
        value={value}
        onChangeText={setValue}
        cellCount={CELL_COUNT}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoFocus={true}
        {...props}
        renderCell={({index, symbol, isFocused}) => (
          <Text
            key={index}
            style={[
              styles.verifySms__inputCell,
              isFocused && styles.verifySms__inputFocusCell,
            ]}
            onLayout={getCellOnLayoutHandler(index)}>
            {symbol || (isFocused ? <Cursor /> : null)}
          </Text>
        )}
      />

      <View style={styles.verifySms__subTitleBox}>
        {expire > 0 ? (
          <Text style={styles.verifySms__subTitle}>
            Повторная отправка достпуна через{' '}
            <Text style={{color: 'black'}}>{expire}</Text>
          </Text>
        ) : (
          <Text style={styles.verifySms__subTitle}>
            Не пришел смс-код?{' '}
            <TouchableOpacity onPress={handleSendSmsAgain}>
              <Text style={styles.verifySms__smsTitle}>Отправить повторно</Text>
            </TouchableOpacity>
          </Text>
        )}
      </View>

      <Errors errors={errors} />

      <MainButton
        title={'Подтвердить смс-код'}
        handlePress={handleVerifySms}
        disabled={disabled}
        marginTop={30}
      />
    </KeyboardView>
  );
}

const styles = StyleSheet.create({
  verifySms__title: {
    alignSelf: 'center',
    color: 'black',
    fontSize: 25,
    width: windowWidth - 30,
    marginTop: 30,
    marginBottom: 30,
  },

  verifySms__container: {
    backgroundColor: 'white',
    borderWidth: 0.2,
    borderColor: 'grey',
  },

  verifySms__input: {
    alignSelf: 'center',
    width: windowWidth - 30,
  },

  verifySms__inputCell: {
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.1)',
    lineHeight: 45,
    width: TEXT_INPUT_SIZE,
    height: TEXT_INPUT_SIZE,
    fontSize: 25,
    textAlign: 'center',
    borderRadius: 10,
  },
  verifySms__inputFocusCell: {
    borderWidth: 1,
    borderColor: colors.green,
  },

  verifySms__subTitleBox: {
    marginTop: 15,
    flexDirection: 'row',
    width: windowWidth - 30,
    alignSelf: 'center',
    alignItems: 'center',
  },

  verifySms__subTitle: {
    color: 'grey',
  },

  verifySms__smsTitle: {
    color: colors.blue,
    textDecorationLine: 'underline',
    bottom: -3,
  },
});

export default connect(null, mapDispatchToProps)(VerifySms);
