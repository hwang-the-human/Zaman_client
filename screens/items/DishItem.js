import React, {useEffect, useRef} from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import colors from '../extensions/Colors';
import _ from 'lodash';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import FooterItem from './FooterItem';
import {connect} from 'react-redux';
import FooterSingleItem from './FooterSingleItem';
import currencyFormatter from 'currency-formatter';

const windowWidth = Dimensions.get('window').width;

const MARGIN_WIDTH = windowWidth - 30;
const IMAGE_HEIGHT = MARGIN_WIDTH * 0.5;

function mapStateToProps(state) {
  return {
    orders: state.ordersReducer,
  };
}

function DishItem({dish, cafe_id, orders, scrollRef, config, yAxis}) {
  const opened = useSharedValue(false);
  const isOrdered = useSharedValue(false);
  const dishRef = useRef();

  function handleOpenDish() {
    if (dish.in_stock) {
      dishRef.current.measure((x, y, width, height, pageX, pageY) => {
        scrollRef.current.scrollTo({x: 0, y: yAxis.value + pageY});
        opened.value = opened.value ? false : true;
      });
    }
  }

  useEffect(() => {
    if (_.find(orders, {dish_id: dish._id})) {
      isOrdered.value = true;
    } else {
      isOrdered.value = false;
    }
  }, [orders]);

  const containerStyle = useAnimatedStyle(() => {
    return {
      maxHeight: withTiming(opened.value ? 1000 : 100, config),
    };
  }, [opened.value]);

  const imageStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(opened.value ? MARGIN_WIDTH : 100, config),
      height: withTiming(opened.value ? IMAGE_HEIGHT : 100, config),
    };
  }, [opened.value]);

  const spaceStyle = useAnimatedStyle(() => {
    return {
      width: '100%',
      height: withTiming(opened.value ? IMAGE_HEIGHT + 15 : 0, config),
    };
  }, [opened.value]);

  const infoBoxStyle = useAnimatedStyle(() => {
    return {
      minHeight: 100,
      maxHeight: withTiming(opened.value ? 300 : 100, config),
      width: withTiming(
        opened.value ? MARGIN_WIDTH : MARGIN_WIDTH - 100,
        config,
      ),
    };
  }, [opened.value]);

  const subTitleBox = useAnimatedStyle(() => {
    return {
      minHeight: 40,
      maxHeight: withTiming(opened.value ? 1000 : 40, config),
    };
  }, [opened.value]);

  const stickStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(isOrdered.value ? 0 : -6, config),
        },
      ],
    };
  }, [isOrdered.value]);

  return (
    <View style={styles.dishItem} ref={dishRef}>
      <TouchableWithoutFeedback onPress={handleOpenDish}>
        <Animated.View style={[styles.dishItem__container, containerStyle]}>
          <Animated.View style={spaceStyle} />
          <Animated.Image
            style={[styles.dishItem__image, imageStyle]}
            source={{
              uri: dish.image,
            }}
          />
          <Animated.View style={[styles.dishItem__infoBox, infoBoxStyle]}>
            <View style={styles.dishItem__titleBox}>
              <Text style={styles.dishItem__title}>{dish.title}</Text>
            </View>
            <Animated.View style={[styles.dishItem__subTitleBox, subTitleBox]}>
              <Text style={styles.dishItem__subTitle} numberOfLines={100}>
                {dish.description}
              </Text>
            </Animated.View>
            <View style={styles.dishItem__priceTextBox}>
              <Text style={styles.dishItem__priceText}>
                {currencyFormatter.format(dish.price, {
                  symbol: 'тг',
                  thousand: ',',
                  precision: 0,
                  format: '%v %s',
                })}
              </Text>
            </View>
          </Animated.View>

          {orders.map(
            (footer, i) =>
              footer.dish_id === dish._id &&
              footer.prerequisites && (
                <FooterItem footer={footer} cafe_id={cafe_id} key={i} />
              ),
          )}
          <FooterSingleItem
            dish={dish}
            cafe_id={cafe_id}
            order={
              dish.prerequisites > 1
                ? null
                : _.find(orders, {dish_id: dish._id})
            }
          />
        </Animated.View>
      </TouchableWithoutFeedback>
      <Animated.View style={[styles.dishItem__stick, stickStyle]} />

      {!dish.in_stock && <View style={styles.dishItem__inStock} />}
    </View>
  );
}

const styles = StyleSheet.create({
  dishItem: {
    width: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
    borderBottomWidth: 0.2,
    borderColor: 'grey',
    paddingTop: 15,
    paddingBottom: 15,
  },

  dishItem__stick: {
    position: 'absolute',
    top: 15,
    left: 0,
    width: 6,
    height: '100%',
    backgroundColor: colors.green,
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
  },

  dishItem__container: {
    overflow: 'hidden',
    width: MARGIN_WIDTH,
  },

  dishItem__image: {
    position: 'absolute',
    borderRadius: 10,
    zIndex: 1,
    right: 0,
  },

  dishItem__infoBox: {
    justifyContent: 'space-between',
  },

  dishItem__titleBox: {
    justifyContent: 'center',
    height: 30,
  },

  dishItem__title: {
    fontSize: 18,
    fontWeight: '600',
  },

  dishItem__subTitleBox: {
    justifyContent: 'center',
  },

  dishItem__subTitle: {
    color: 'grey',
    fontWeight: '500',
  },

  dishItem__priceTextBox: {
    justifyContent: 'center',
    height: 30,
  },

  dishItem__priceText: {
    color: colors.green,
    fontWeight: '500',
    fontSize: 16,
  },

  dishItem__inStock: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.5)',
    width: '100%',
    height: IMAGE_HEIGHT,
  },
});

export default connect(mapStateToProps, null)(DishItem);
