import React from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import HeaderButton from '../rightSide/home/cafe/HeaderButton';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import colors from '../extensions/Colors';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Header({paymentScreen, setPaymentScreen, config}) {
  function handleClosePayment() {
    setPaymentScreen({...paymentScreen, opened: false});
  }

  return (
    <View style={styles.header}>
      <View style={styles.header__container}>
        <HeaderButton
          icon={<FontAwesome name="close" size={20} color="white" />}
          handleClick={handleClosePayment}
          selectedScreen={paymentScreen}
          config={config}
        />
        <Text style={styles.header__title}>Оплата заказа</Text>
        <View style={styles.header__space} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 100,
    width: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
    borderBottomWidth: 0.2,
    borderBottomColor: colors.grey,
    // flexDirection: 'row',
  },

  header__container: {
    position: 'absolute',
    width: windowWidth - 30,
    bottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  header__title: {
    alignSelf: 'center',
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
  },

  header__space: {
    width: 35,
    height: 35,
  },
});
