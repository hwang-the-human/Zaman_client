import React from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import Animated from 'react-native-reanimated';
import Header from '../extensions/Header';
import NavigateButton from '../payment/NavigateButton';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const windowWidth = Dimensions.get('window').width;

export default function Settings() {
  const navigation = useNavigation();

  function handleRecoveryPassword() {
    navigation.navigate('SendSms', {
      recoveryPassword: true,
    });
  }
  return (
    <View style={styles.settings}>
      <Header title={'Настройки'} />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        scrollEventThrottle={16}>
        <View style={styles.settings__container}>
          <View style={styles.settings__buttonBox}>
            <NavigateButton
              title={'Изменить пароль'}
              handleClick={handleRecoveryPassword}
              icon={
                <Ionicons name="lock-closed-outline" size={30} color="black" />
              }
            />
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  settings: {
    width: '100%',
    height: '100%',
  },

  settings__container: {
    marginTop: 30,
    backgroundColor: 'white',
    alignItems: 'center',
    borderWidth: 0.2,
    borderColor: 'grey',
  },

  settings__buttonBox: {
    width: windowWidth - 30,
  },
});
