import React from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import Animated, {
  withSpring,
  useAnimatedStyle,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import currencyFormatter from 'currency-formatter';
import CustomButton from '../../../extensions/CustomButton';
import colors from '../../../extensions/Colors';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function CheckOutButton({
  opened,
  showCheckOut,
  handleCheckOut,
  totalCount,
  totalPrice,
  config,
}) {
  const checkOutButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(
            showCheckOut.value && opened ? 0 : 100,
            config,
          ),
        },
      ],
    };
  }, [showCheckOut.value, opened]);

  const countTextStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSequence(withSpring(1.1), withSpring(1)),
        },
      ],
    };
  }, [totalCount]);

  return (
    <Animated.View style={[styles.checkOutButton, checkOutButtonStyle]}>
      <CustomButton handleButton={handleCheckOut}>
        <View style={styles.checkOutButton__container}>
          <View style={styles.checkOutButton__textContainer}>
            <View style={styles.checkOutButton__textBox}>
              <Animated.View
                style={[styles.checkOutButton__countText, countTextStyle]}>
                <Text
                  style={[
                    styles.checkOutButton__buttonText,
                    {color: colors.green},
                  ]}>
                  {totalCount}
                </Text>
              </Animated.View>
              <Text style={styles.checkOutButton__buttonText}>Заказать</Text>
            </View>
            <Text style={styles.checkOutButton__buttonText}>
              {currencyFormatter.format(totalPrice, {
                symbol: 'тг',
                thousand: ',',
                precision: 0,
                format: '%v %s',
              })}
            </Text>
          </View>
        </View>
      </CustomButton>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  checkOutButton: {
    position: 'absolute',
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.5)',
    bottom: 0,
    height: 100,
    borderRadius: 100,
  },

  checkOutButton__container: {
    backgroundColor: colors.green,
    justifyContent: 'center',
    alignItems: 'center',
    width: windowWidth - 30,
    height: 50,
    borderRadius: 50,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },

  checkOutButton__textContainer: {
    height: '100%',
    width: windowWidth - 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  checkOutButton__textBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkOutButton__countText: {
    backgroundColor: 'white',
    fontSize: 18,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    color: colors.green,
    borderRadius: 100,
    marginRight: 15,
  },

  checkOutButton__buttonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 18,
  },
});
