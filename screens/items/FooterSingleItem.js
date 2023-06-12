import React from 'react';
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
import {
  setBottomMenu,
  pushOrder,
  changeQuantityOrder,
  removeOrder,
} from '../../redux/Reducers';
import _ from 'lodash';

function mapDispatchToProps(dispatch) {
  return {
    setBottomMenu: bottomMenu => dispatch(setBottomMenu(bottomMenu)),
    pushOrder: order => dispatch(pushOrder(order)),
    changeQuantityOrder: (path_id, _id, quantity) =>
      dispatch(changeQuantityOrder(path_id, _id, quantity)),
    removeOrder: (path_id, _id) => dispatch(removeOrder(path_id, _id)),
  };
}

function FooterItem({
  dish,
  order,
  cafe_id,
  setBottomMenu,
  pushOrder,
  changeQuantityOrder,
  removeOrder,
}) {
  const buttonScale = useSharedValue(1);

  function handleAddButton() {
    if (dish.prerequisites.length === 0) {
      const newOrder = {
        cafe_id: cafe_id,
        dish_id: dish._id,
        title: dish.title,
        price: dish.price,
        quantity: 1,
      };
      pushOrder(newOrder);
    } else {
      setBottomMenu({
        screen: 'Prerequisites',
        opened: true,
        data: {...dish, cafe_id: cafe_id},
      });
    }
  }

  function handlePlusButton() {
    changeQuantityOrder('dish_id', dish._id, 1);
  }
  function handleMinusButton() {
    if (order.quantity > 1) {
      changeQuantityOrder('dish_id', dish._id, -1);
    } else {
      removeOrder('dish_id', dish._id);
    }
  }

  const panGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      buttonScale.value = withSpring(0.9);
    },
    onFail: (e, ctx) => {
      buttonScale.value = withSpring(1);
    },
    onEnd: _ => {
      buttonScale.value = withSpring(1);
      runOnJS(handleAddButton)();
    },
  });

  const addButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: buttonScale.value,
        },
      ],
    };
  }, [buttonScale.value]);

  const countButtonBoxStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY:
            dish.prerequisites.length > 1
              ? -40
              : withTiming(order?.quantity ?? 0 > 1 ? 0 : -40, {duration: 100}),
        },
      ],
    };
  });

  return (
    <View style={styles.footerItem}>
      <Text style={styles.footerItem__countText}>
        {dish.prerequisites.length < 1 && `Количество: ${order?.quantity ?? 0}`}
      </Text>
      <View style={styles.footerItem__buttonBox}>
        <TapGestureHandler
          onGestureEvent={panGestureHandler}
          shouldCancelWhenOutside={true}>
          <Animated.View style={[styles.footerItem__addButton, addButtonStyle]}>
            <Text style={styles.footerItem__addButtonText}>Добавить</Text>
          </Animated.View>
        </TapGestureHandler>

        <Animated.View
          style={[styles.footerItem__countButtonBox, countButtonBoxStyle]}>
          <TouchableOpacity onPress={handleMinusButton}>
            <View style={styles.footerItem__countButton}>
              <AntDesign name="minus" size={20} color="black" />
            </View>
          </TouchableOpacity>

          <View
            style={{height: '100%', width: 0.5, backgroundColor: 'black'}}
          />

          <TouchableOpacity onPress={handlePlusButton}>
            <View style={styles.footerItem__countButton}>
              <AntDesign name="plus" size={20} color="black" />
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footerItem: {
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  footerItem__countText: {
    fontSize: 16,
    fontWeight: '500',
  },

  footerItem__buttonBox: {
    overflow: 'hidden',
    borderRadius: 10,
    height: 40,
    width: 100,
  },

  footerItem__addButton: {
    backgroundColor: colors.green,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    borderWidth: 0.2,
    borderColor: 'black',
    borderRadius: 10,
  },

  footerItem__addButtonText: {
    fontWeight: '500',
    color: 'white',
  },

  footerItem__countButtonBox: {
    position: 'absolute',
    flexDirection: 'row',
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
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
