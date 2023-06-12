import React from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

const windowWidth = Dimensions.get('window').width;

export default function Info({track}) {
  return (
    <View style={styles.info}>
      <View style={styles.info__container}>
        <Text style={styles.info__title}>Информация о заказе</Text>
        <View style={styles.info__option}>
          <MaterialCommunityIcons
            name="comment-text-outline"
            size={30}
            color="grey"
          />
          <View style={styles.info__textBox}>
            <Text style={styles.info__text} numberOfLines={1}>
              Комментарий для ресторана:
            </Text>
            <Text style={styles.info__subText}>Kакой-то коммент</Text>
          </View>
        </View>

        <View style={styles.info__option}>
          <AntDesign name="home" size={30} color="grey" />
          <View style={styles.info__textBox}>
            <Text style={styles.info__text} numberOfLines={1}>
              Адрес доставки:
            </Text>
            <Text style={styles.info__subText}>
              {track.client.address.street} {track.client.address.aptNumber}
            </Text>
          </View>
        </View>

        <View style={styles.info__option}>
          <MaterialCommunityIcons
            name="credit-card-outline"
            size={30}
            color="grey"
          />
          <View style={styles.info__textBox}>
            <Text style={styles.info__text} numberOfLines={1}>
              Способ оплаты:
            </Text>
            <Text style={styles.info__subText}>
              {track.client.payment === 'Наличными'
                ? track.client.payment
                : '**** **** **** ' + track.client.payment.number.substr(-4)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  info: {
    marginTop: 30,
    alignItems: 'center',
  },

  info__container: {
    width: windowWidth - 30,
  },

  info__option: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  info__title: {
    marginBottom: 15,
    fontSize: 25,
    fontWeight: '600',
  },

  info__textBox: {
    flex: 1,
    borderBottomWidth: 0.2,
    borderBottomColor: 'grey',
    marginLeft: 15,
    paddingTop: 15,
    paddingBottom: 15,
  },

  info__text: {
    fontSize: 16,
  },

  info__subText: {
    color: 'grey',
  },
});
