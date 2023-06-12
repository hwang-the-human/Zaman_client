import React from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import NavigateButton from './NavigateButton';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

const windowWidth = Dimensions.get('window').width;

export default function Info({currentOrder}) {
  const navigation = useNavigation();

  function handleAddComment() {
    navigation.navigate('Comment');
  }
  function handleAddresses() {
    navigation.navigate('Address');
  }
  function handleCards() {
    navigation.navigate('Cards');
  }

  return (
    <View style={styles.info}>
      <View style={styles.info__container}>
        <Text style={styles.info__title}>Информация</Text>
        <NavigateButton
          title={'Комментарий для ресторана'}
          handleClick={handleAddComment}
          icon={
            <MaterialCommunityIcons
              name="comment-text-outline"
              size={30}
              color="black"
            />
          }
        />
        <NavigateButton
          title={'Адрес доставки'}
          subTitle={
            currentOrder.address ? currentOrder.address.street : 'Не указано'
          }
          handleClick={handleAddresses}
          icon={<AntDesign name="home" size={30} color="black" />}
        />
        <NavigateButton
          title={'Способ оплаты'}
          subTitle={
            currentOrder.payment
              ? currentOrder.payment === 'Наличными'
                ? currentOrder.payment
                : '**** **** **** ' + currentOrder.payment.number.substr(-4)
              : 'Не указано'
          }
          handleClick={handleCards}
          icon={
            <MaterialCommunityIcons
              name="credit-card-outline"
              size={30}
              color="black"
            />
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  info: {
    alignItems: 'center',
    marginTop: 30,
  },

  info__container: {
    width: windowWidth - 30,
  },

  info__title: {
    marginBottom: 15,
    fontSize: 25,
    fontWeight: '600',
  },
});
