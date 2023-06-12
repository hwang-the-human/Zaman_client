import React from 'react';
import {StyleSheet, Text, View, Linking} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../extensions/Colors';
import Header from '../../extensions/Header';
import CustomButton from '../../extensions/CustomButton';
import phoneFormatter from 'phone-formatter';

export default function Help() {
  function handleWhatsapp() {
    Linking.openURL('whatsapp://send?phone=xxxxxxxxxxxxx');
  }

  function handleTelegram() {
    Linking.openURL('telegram://send?phone=xxxxxxxxxxxxx');
  }

  return (
    <View>
      <Header title={'Служба поддержки'} />
      <View style={styles.help__contactBox}>
        <View style={styles.help__option}>
          <FontAwesome name="whatsapp" size={30} color="green" />
          <View style={styles.help__buttonBox}>
            <View style={styles.help__titleBox}>
              <Text style={styles.help__title}>Николай Хван</Text>

              <Text style={styles.help__subTitle}>
                {phoneFormatter.format('+7701555395', '+7 (NNN) NNN-NN-NN')}
              </Text>
            </View>
            <CustomButton handleButton={handleWhatsapp}>
              <View style={styles.help__button}>
                <Text style={styles.help__textButton}>Написать</Text>
              </View>
            </CustomButton>
          </View>
        </View>

        <View style={styles.help__option}>
          <FontAwesome name="telegram" size={30} color="black" />
          <View style={styles.help__buttonBox}>
            <View style={styles.help__titleBox}>
              <Text style={styles.help__title}>Денис Сон</Text>

              <Text style={styles.help__subTitle}>
                {phoneFormatter.format('+7701555395', '+7 (NNN) NNN-NN-NN')}
              </Text>
            </View>
            <CustomButton handleButton={handleTelegram}>
              <View style={styles.help__button}>
                <Text style={styles.help__textButton}>Написать</Text>
              </View>
            </CustomButton>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  help__contactBox: {
    backgroundColor: 'white',
    marginTop: 60,
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 0.2,
    borderColor: 'grey',
  },
  help__option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  help__buttonBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    paddingTop: 15,
    paddingBottom: 15,

    borderBottomColor: 'grey',
    borderBottomWidth: 0.2,
  },

  help__titleBox: {
    flex: 1,
    justifyContent: 'center',
  },

  help__title: {
    fontSize: 16,
    marginRight: 15,
  },

  help__subTitle: {
    color: 'grey',
  },

  help__button: {
    backgroundColor: colors.green,
    padding: 10,
    borderRadius: 100,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },

  help__textButton: {
    color: 'white',
    fontWeight: '500',
  },
});
