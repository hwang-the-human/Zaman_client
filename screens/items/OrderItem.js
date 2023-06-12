import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import colors from '../extensions/Colors';
import {connect} from 'react-redux';
import {changeQuantityOrder, removeOrder} from '../../redux/Reducers';
import currencyFormatter from 'currency-formatter';

function mapDispatchToProps(dispatch) {
  return {
    changeQuantityOrder: (path_id, _id, quantity) =>
      dispatch(changeQuantityOrder(path_id, _id, quantity)),
    removeOrder: (path_id, _id) => dispatch(removeOrder(path_id, _id)),
  };
}

function OrderItem({order, changeQuantityOrder, removeOrder, paymentScreen}) {
  function handlePlusButton() {
    if (order.prerequisites) {
      changeQuantityOrder('footer_id', order.footer_id, 1);
    } else {
      changeQuantityOrder('dish_id', order.dish_id, 1);
    }
  }

  function handleMinusButton() {
    if (order.prerequisites) {
      if (order.quantity > 1) {
        changeQuantityOrder('footer_id', order.footer_id, -1);
      } else {
        removeOrder('footer_id', order.footer_id);
      }
    } else {
      if (order.quantity > 1) {
        changeQuantityOrder('dish_id', order.dish_id, -1);
      } else {
        removeOrder('dish_id', order.dish_id);
      }
    }
  }

  return (
    <View style={styles.orderItem}>
      <View style={styles.orderItem__titleBox}>
        <Text style={styles.orderItem__title}>
          <Text style={styles.orderItem__countText}>
            {order.quantity}x{'  '}
          </Text>
          {order.title}
          {'  '}
          <Text style={{color: colors.green}}>
            {currencyFormatter.format(order.price * order.quantity, {
              symbol: 'тг',
              thousand: ',',
              precision: 0,
              format: '%v %s',
            })}
          </Text>
        </Text>
        <View style={styles.orderItem__prerequisitesBox}>
          {order.prerequisites &&
            order.prerequisites.map((prerequisite, i) => (
              <Text style={styles.orderItem__prerequisitesText} key={i}>
                {prerequisite.title}
                {i + 1 < order.prerequisites.length && ', '}
              </Text>
            ))}
        </View>
      </View>

      {paymentScreen && (
        <View style={styles.orderItem__countButtonBox}>
          <TouchableOpacity onPress={handlePlusButton}>
            <View style={styles.orderItem__countButton}>
              <AntDesign name="plus" size={20} color="black" />
            </View>
          </TouchableOpacity>
          <View
            style={{height: '100%', width: 0.5, backgroundColor: 'black'}}
          />
          <TouchableOpacity onPress={handleMinusButton}>
            <View style={styles.orderItem__countButton}>
              <AntDesign name="minus" size={20} color="black" />
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 0.2,
    borderColor: 'grey',
  },

  orderItem__titleBox: {
    flex: 1,
  },

  orderItem__title: {
    fontSize: 18,
  },

  orderItem__countText: {
    fontWeight: 'bold',
  },

  orderItem__prerequisitesBox: {
    flexWrap: 'wrap',
    alignItems: 'center',
    flexDirection: 'row',
  },

  orderItem__prerequisitesText: {
    color: 'grey',
  },

  orderItem__countButtonBox: {
    overflow: 'hidden',
    flexDirection: 'row',
    backgroundColor: 'white',
    borderWidth: 0.2,
    borderColor: 'black',
    borderRadius: 10,
    height: 40,
  },

  orderItem__countButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: 50,
    backgroundColor: 'white',
  },
});

export default connect(null, mapDispatchToProps)(OrderItem);
