import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import colors from '../extensions/Colors';
import {connect} from 'react-redux';
import _ from 'lodash';
import Summary from './Summary';
import Orders from './Orders';
import Info from './Info';
import Zigzag from '../extensions/Zigzag';
import {
  setPaymentLoading,
  pushTrackedOrder,
  setCurrentOrder,
} from '../../redux/Reducers';
import {useNavigation, useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainButton from '../extensions/MainButton';
import api from '../extensions/Api';
import axios from 'axios';
import PushNotification from 'react-native-push-notification';

function mapStateToProps(state) {
  return {
    user: state.userReducer,
    orders: state.ordersReducer,
    currentOrder: state.currentOrderReducer,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setPaymentLoading: (opened, success) =>
      dispatch(setPaymentLoading(opened, success)),
    pushTrackedOrder: trackedOrder => dispatch(pushTrackedOrder(trackedOrder)),
    setCurrentOrder: currentOrder => dispatch(setCurrentOrder(currentOrder)),
  };
}

function Payment({
  orders,
  user,
  setPaymentLoading,
  pushTrackedOrder,
  setCurrentOrder,
  currentOrder,
}) {
  const navigation = useNavigation();
  const {params} = useRoute();

  function handleNotification() {
    PushNotification.localNotificationSchedule({
      message: 'Курьер подобрал ваш заказ!',
      date: new Date(Date.now() + 600 * 1000),
      allowWhileIdle: true,
    });
  }

  async function handleConfirmOrder() {
    if (
      currentOrder.payment &&
      currentOrder.address &&
      currentOrder.orders.length > 0
    ) {
      setPaymentLoading(true, false);

      const newOrder = {
        restaurant: {
          _id: params.cafe._id,
          title: params.cafe.title,
          address: params.cafe.address,
          phone: params.cafe.phone,
          image: params.cafe.image,
        },
        client: {
          _id: user._id,
          name: user.name,
          surname: user.surname,
          phone: user.phone,
          address: currentOrder.address,
          payment: currentOrder.payment,
        },
        orders: currentOrder.orders,
        total_price: currentOrder.totalPrice,
      };

      try {
        const response = await axios.post(api.orders.place_order, newOrder, {
          headers: {
            'x-auth-token': user.authToken,
          },
        });

        navigation.goBack();
        setPaymentLoading(false, true);
        pushTrackedOrder(response.data);
        handleNotification();
      } catch (error) {
        console.log(error);
        setPaymentLoading(false, false);
      }
    }
  }

  async function getDefaultValues() {
    try {
      const response = await AsyncStorage.multiGet([
        'defaultAddress',
        'defaultPayment',
      ]);
      setCurrentOrder({
        address: JSON.parse(response[0][1]),
        payment: JSON.parse(response[1][1]),
      });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getDefaultValues();
  }, []);

  useEffect(() => {
    var price = 0;
    var currentOrders = [];

    for (let i = 0; i < orders.length; i++) {
      if (orders[i].cafe_id === params.cafe._id) {
        currentOrders.push(_.omit(orders[i], 'cafe_id'));

        price += orders[i].price * orders[i].quantity;
      }
    }

    setCurrentOrder({
      orders: currentOrders,
      totalPrice: price,
    });
  }, [orders]);

  return (
    <View style={styles.payment}>
      <ScrollView scrollEventThrottle={16}>
        <View style={styles.payment__container}>
          <Orders currentOrder={currentOrder} />
          <Info currentOrder={currentOrder} />
          <Zigzag />
        </View>
        <Summary totalPrice={currentOrder.totalPrice} delPrice={300} />
        <View style={styles.payment__space} />
      </ScrollView>

      <View style={styles.payment__buttonBox}>
        <MainButton
          title="Подтвердить заказ"
          handlePress={handleConfirmOrder}
          disabled={
            currentOrder.payment &&
            currentOrder.address &&
            currentOrder.orders.length > 0
              ? false
              : true
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  payment: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.lightGrey,
  },

  payment__container: {
    backgroundColor: 'white',
    paddingBottom: 30,
  },

  payment__space: {
    width: '100%',
    height: 100,
  },

  payment__buttonBox: {
    position: 'absolute',
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.5)',
    bottom: 0,
    height: 100,
    borderRadius: 100,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Payment);
