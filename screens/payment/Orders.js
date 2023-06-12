import React from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import OrderItem from '../items/OrderItem';
import colors from '../extensions/Colors';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Orders({currentOrder}) {
  return (
    <View style={styles.orders}>
      <View style={styles.orders__categoryBox}>
        <Text style={styles.orders__title}>Ваш заказ</Text>
        <Text style={styles.orders__subTitle}>
          {currentOrder.orders?.length} продукт из Макдака
        </Text>
        {currentOrder.orders?.map((order, i) => (
          <OrderItem order={order} key={i} paymentScreen={true} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  orders: {
    alignItems: 'center',
    marginTop: 30,
  },

  orders__categoryBox: {
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
