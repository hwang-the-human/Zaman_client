import React from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import OrderItem from '../items/OrderItem';

const windowWidth = Dimensions.get('window').width;

export default function Orders({track}) {
  return (
    <View style={styles.orders}>
      <View style={styles.orders__contianer}>
        <Text style={styles.orders__title}>Ваш заказ</Text>
        <Text style={styles.orders__subTitle}>
          {track.orders.length} продукт из {track.restaurant.title}
        </Text>
        {track.orders.map((order, i) => (
          <OrderItem order={order} key={i} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  orders: {
    paddingTop: 30,
    alignItems: 'center',
  },

  orders__contianer: {
    width: windowWidth - 30,
  },

  orders__title: {
    fontSize: 25,
    fontWeight: '600',
  },

  orders__subTitle: {
    color: 'grey',
    marginBottom: 15,
  },
});
