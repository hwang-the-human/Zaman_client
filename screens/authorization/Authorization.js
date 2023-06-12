import React from 'react';
import {StyleSheet, Image, View, StatusBar, Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MainButton from '../extensions/MainButton';
import colors from '../extensions/Colors';

const windowHeight = Dimensions.get('window').height;

export default function Authorization() {
  const navigation = useNavigation();

  function handleSignIn() {
    navigation.navigate('SignIn');
  }

  function handleSignUp() {
    navigation.navigate('SendSms', {
      recoveryPassword: false,
    });
  }

  return (
    <View style={styles.authorization}>
      <StatusBar animated={true} barStyle="light-content" />
      <Image
        style={styles.authorization__logo}
        source={require('../../images/logo.jpg')}
      />
      <MainButton
        title={'Войти'}
        handlePress={handleSignIn}
        color={'white'}
        titleColor={'black'}
      />
      <View style={styles.authorization__space} />
      <MainButton
        title={'Зарегистрироваться'}
        handlePress={handleSignUp}
        color={'white'}
        titleColor={'black'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  authorization: {
    backgroundColor: colors.green,
    width: '100%',
    height: '100%',
  },

  authorization__title: {
    position: 'absolute',
    fontSize: 30,
    fontWeight: '700',
    top: 200,
  },

  authorization__space: {
    height: 30,
  },

  authorization__logo: {
    width: '100%',
    height: windowHeight * 0.4,
  },
});
