import React, {useState, useRef} from 'react';
import {StyleSheet, Text, View, Dimensions, Keyboard} from 'react-native';
import MainButton from '../extensions/MainButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import InputField from './InputField';
import Errors from './Errors';
import {connect} from 'react-redux';
import {setLoading} from '../../redux/Reducers';
import {useRoute} from '@react-navigation/native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import api from '../extensions/Api';
import KeyboardView from '../extensions/KeyboardView';

function mapDispatchToProps(dispatch) {
  return {
    setLoading: (opened, done) => dispatch(setLoading(opened, done)),
  };
}

const windowWidth = Dimensions.get('window').width;

function RecoveryPassword({setLoading}) {
  const {params} = useRoute();
  const navigation = useNavigation();

  const [errors, setErrors] = useState([]);

  const [newPassword, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const passwordRef = useRef(null);
  const repeatPasswordRef = useRef(null);

  function validatePassword(p) {
    if (p.length === 0) {
      return `"Пароль" обязательное поле`;
    } else if (p.length < 8) {
      return '"Пароль" должно иметь минимальную длину 8';
    } else if (p.length > 50) {
      return '"Пароль" должно иметь максимальную длину 50';
    } else if (p.search(/[a-z]/i) < 0) {
      return '"Пароль" должен содержать хотя бы одну букву.';
    } else if (p.search(/[0-9]/) < 0) {
      return '"Пароль" должен содержать хотя бы одну цифру';
    } else {
      return null;
    }
  }

  async function handleRecoverPassword() {
    const error = [];

    const validated = validatePassword(newPassword);
    if (validated) {
      error.push({message: validated});
    }

    if (newPassword !== repeatPassword) {
      error.push({message: 'Пароли должны совпадать'});
    }

    setErrors(error);

    if (error.length < 1) {
      Keyboard.dismiss();
      setLoading(true, false);
      setErrors([]);
      try {
        await axios.patch(
          api.clients.recover_password,
          {
            phone: params.phone,
            smsCode: params.smsCode,
            newPassword: newPassword,
          },
          {
            headers: {'x-sms-id-token': params.smsIdToken},
          },
        );
        navigation.popToTop();
      } catch (error) {
        setErrors([
          {
            message: error.response ? error.response.data : error.message,
          },
        ]);
      }
    }
    setLoading(true, true);
  }

  return (
    <KeyboardView>
      <Text style={styles.recoveryPassword__title}>Введите новый пароль</Text>

      <View style={styles.recoveryPassword__inputFieldBox}>
        <InputField
          inputRef={passwordRef}
          nextRef={repeatPasswordRef}
          input={newPassword}
          setInput={setPassword}
          placeholder="Новый пароль"
          returnKey={'next'}
          autoFocus={true}
          maxLength={50}
          icon={<Ionicons name="lock-open-outline" size={30} color="grey" />}
        />

        <InputField
          inputRef={repeatPasswordRef}
          input={repeatPassword}
          setInput={setRepeatPassword}
          placeholder="Повторите новый пароль"
          returnKey={'go'}
          maxLength={50}
          submit={handleRecoverPassword}
          icon={<Ionicons name="lock-closed-outline" size={30} color="grey" />}
        />
      </View>

      <Errors errors={errors} />

      <MainButton
        title={'Восстановить'}
        handlePress={handleRecoverPassword}
        marginTop={30}
      />
    </KeyboardView>
  );
}

const styles = StyleSheet.create({
  recoveryPassword__title: {
    alignSelf: 'center',
    color: 'black',
    fontSize: 25,
    width: windowWidth - 30,
    marginTop: 30,
    marginBottom: 30,
  },
  recoveryPassword__inputFieldBox: {
    backgroundColor: 'white',
    borderWidth: 0.2,
    borderColor: 'grey',
  },
});

export default connect(null, mapDispatchToProps)(RecoveryPassword);
