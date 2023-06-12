import React, {useState, useRef} from 'react';
import {StyleSheet, Text, View, Dimensions, Keyboard} from 'react-native';
import MainButton from '../extensions/MainButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import InputField from './InputField';
import Errors from './Errors';
import Joi from 'joi';
import {connect} from 'react-redux';
import {setLoading, setUser} from '../../redux/Reducers';
import {useRoute} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import _ from 'lodash';
import api from '../extensions/Api';
import KeyboardView from '../extensions/KeyboardView';

function mapDispatchToProps(dispatch) {
  return {
    setLoading: (opened, done) => dispatch(setLoading(opened, done)),
    setUser: user => dispatch(setUser(user)),
  };
}

const windowWidth = Dimensions.get('window').width;

function SignUp({setLoading, setUser}) {
  const {params} = useRoute();
  const navigation = useNavigation();

  const [errors, setErrors] = useState([]);

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const nameRef = useRef(null);
  const surnameRef = useRef(null);
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

  function customMessages(title) {
    return {
      'string.empty': `${title} обязательное поле.`,
      'string.min': `${title} должно иметь минимальную длину {#limit}.`,
      'string.max': `${title} должно иметь максимальную длину {#limit}.`,
    };
  }

  const schema = Joi.object({
    name: Joi.string()
      .min(1)
      .max(50)
      .required()
      .messages(customMessages('Имя')),
    surname: Joi.string()
      .min(1)
      .max(50)
      .required()
      .messages(customMessages('Фамилия')),
  });

  async function handleSignUp() {
    var {error} = schema.validate(
      {
        name: name,
        surname: surname,
      },
      {abortEarly: false},
    );

    error = error ?? {details: []};

    const validated = validatePassword(password);
    if (validated) {
      error.details.push({message: validated});
    }

    if (password !== repeatPassword) {
      error.details.push({message: 'Пароли должны совпадать'});
    }

    setErrors(error.details);

    if (error.details.length < 1) {
      Keyboard.dismiss();
      setLoading(true, false);
      setErrors([]);

      try {
        const response = await axios.post(
          api.clients.sign_up,
          {
            phone: params.phone,
            smsCode: params.smsCode,
            name: _.capitalize(name),
            surname: _.capitalize(surname),
            password: password,
          },
          {
            headers: {'x-sms-id-token': params.smsIdToken},
          },
        );

        await AsyncStorage.setItem(
          'authToken',
          response.headers['x-auth-token'],
        );

        setUser({
          ...response.data,
          authToken: response.headers['x-auth-token'],
        });

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
      <Text style={styles.signUp__title}>Введите персональные данные</Text>

      <View style={styles.signUp__inputFieldBox}>
        <InputField
          inputRef={nameRef}
          nextRef={surnameRef}
          input={name}
          setInput={setName}
          placeholder="Имя"
          returnKey={'next'}
          autoFocus={true}
          maxLength={50}
          icon={<Ionicons name="person-outline" size={30} color="grey" />}
        />

        <InputField
          inputRef={surnameRef}
          nextRef={passwordRef}
          input={surname}
          setInput={setSurname}
          placeholder="Фамилия"
          returnKey={'next'}
          maxLength={50}
          icon={<Ionicons name="person-outline" size={30} color="grey" />}
        />

        <InputField
          inputRef={passwordRef}
          nextRef={repeatPasswordRef}
          input={password}
          setInput={setPassword}
          placeholder="Пароль"
          returnKey={'next'}
          maxLength={50}
          icon={<Ionicons name="lock-open-outline" size={30} color="grey" />}
        />

        <InputField
          inputRef={repeatPasswordRef}
          input={repeatPassword}
          setInput={setRepeatPassword}
          placeholder="Повторите пароль"
          returnKey={'go'}
          maxLength={50}
          submit={handleSignUp}
          icon={<Ionicons name="lock-closed-outline" size={30} color="grey" />}
        />
      </View>

      <Errors errors={errors} />

      <MainButton
        title={'Зарегистрироваться'}
        handlePress={handleSignUp}
        marginTop={30}
      />
    </KeyboardView>
  );
}

const styles = StyleSheet.create({
  signUp__title: {
    alignSelf: 'center',
    color: 'black',
    fontSize: 25,
    width: windowWidth - 30,
    marginTop: 30,
    marginBottom: 30,
  },
  signUp__inputFieldBox: {
    backgroundColor: 'white',
    borderWidth: 0.2,
    borderColor: 'grey',
  },
});

export default connect(null, mapDispatchToProps)(SignUp);
