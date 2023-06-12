import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  runOnJS,
  useAnimatedReaction,
  Easing,
  withTiming,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import {
  TapGestureHandler,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import AntDesign from 'react-native-vector-icons/AntDesign';
import colors from '../extensions/Colors';
import {connect} from 'react-redux';
import {removeOrder, changeQuantityOrder} from '../../redux/Reducers';
import _ from 'lodash';

function mapDispatchToProps(dispatch) {
  return {
    changeQuantityOrder: (path_id, _id, quantity) =>
      dispatch(changeQuantityOrder(path_id, _id, quantity)),
    removeOrder: (path_id, _id) => dispatch(removeOrder(path_id, _id)),
  };
}

function FooterItem({footer, changeQuantityOrder, removeOrder}) {
  // const removed = useSharedValue(false);

  function handlePlusButton() {
    changeQuantityOrder('footer_id', footer.footer_id, 1);
  }
  function handleMinusButton() {
    if (footer.quantity > 1) {
      changeQuantityOrder('footer_id', footer.footer_id, -1);
    } else {
      removeOrder('footer_id', footer.footer_id);
    }
    // removed.value = true;
  }

  // const config = {
  //   duration: 500,
  //   easing: Easing.bezier(0.5, 0.01, 0, 1),
  // };

  // function updateRemoveOrder() {
  //   console.log('Deleted:', footer_id);
  //   removeOrder(dish._id, footer_id);
  // }

  const footerItemStyle = useAnimatedStyle(() => {
    return {
      overflow: 'hidden',
      // height: removed.value
      //   ? withTiming(0, config)
      //   : withDelay(
      //       config.duration,
      //       withSequence(withTiming(0, {duration: 0}), withTiming(70, config)),
      //     ),
      // opacity: removed.value
      //   ? withTiming(0, {duration: 1000})
      //   : withDelay(
      //       config.duration,
      //       withSequence(withTiming(0, {duration: 0}), withTiming(1, config)),
      //     ),
    };
  }, []);

  return (
    <Animated.View style={[styles.footerItem, footerItemStyle]}>
      <View style={styles.footerItem__infoBox}>
        <View style={styles.footerItem__option}>
          <Text style={styles.footerItem__title}>
            Количество: {footer.quantity}
          </Text>
        </View>

        <View
          style={[styles.footerItem__option, {marginTop: 5, marginBottom: 5}]}>
          <Text style={styles.footerItem__title}>
            Цена:{' '}
            <Text style={{color: colors.green}}>
              {footer.quantity * footer.price} тг
            </Text>
          </Text>
        </View>

        <View style={styles.footerItem__option}>
          <Text style={styles.footerItem__title}>Добавки: </Text>
          {footer.prerequisites.map((a, i) => (
            <Text style={styles.footerItem__prerequisitesText} key={i}>
              {a.title}
              {footer.prerequisites.length > i + 1 && ', '}
            </Text>
          ))}
        </View>
      </View>
      <View style={styles.footerItem__buttonBox}>
        <TouchableOpacity onPress={handleMinusButton}>
          <View style={styles.footerItem__countButton}>
            <AntDesign name="minus" size={20} color="black" />
          </View>
        </TouchableOpacity>

        <View style={{height: '100%', width: 0.5, backgroundColor: 'black'}} />

        <TouchableOpacity onPress={handlePlusButton}>
          <View style={styles.footerItem__countButton}>
            <AntDesign name="plus" size={20} color="black" />
          </View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  footerItem: {
    // height: 70,
    paddingTop: 15,
    paddingBottom: 15,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.2,
    borderColor: 'grey',
  },

  footerItem__infoBox: {
    flex: 1,
  },

  footerItem__option: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },

  footerItem__title: {
    fontSize: 16,
    fontWeight: '500',
  },

  footerItem__prerequisitesText: {
    color: 'grey',
  },

  footerItem__buttonBox: {
    flexDirection: 'row',
    overflow: 'hidden',
    borderRadius: 10,
    height: 40,
    width: 100,

    borderWidth: 0.2,
    borderColor: 'black',
    borderRadius: 10,
  },

  footerItem__countButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: 50,
  },
});

export default connect(null, mapDispatchToProps)(FooterItem);
