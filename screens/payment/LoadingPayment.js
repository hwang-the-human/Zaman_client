import React, {useEffect} from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  runOnJS,
  withSequence,
  withTiming,
  Easing,
  withDelay,
  withRepeat,
} from 'react-native-reanimated';
import {connect} from 'react-redux';
import * as Progress from 'react-native-progress';
import colors from '../extensions/Colors';
import Entypo from 'react-native-vector-icons/dist/Entypo';

function mapStateToProps(state) {
  return {
    paymentLoading: state.paymentLoadingReducer,
    lastAxis: state.lastAxisTrackReducer,
  };
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const CIRCLE_SIZE = 50;
const CENTER_X = windowWidth / 2 - CIRCLE_SIZE / 2;
const CENTER_Y = windowHeight / 2 - CIRCLE_SIZE / 2;

function LoadingPayment({paymentLoading, lastAxis}) {
  const delay = 3000;

  const config = {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };

  const paymentLoadingStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: paymentLoading.opened
            ? 1
            : withDelay(
                delay + config.duration * 2,
                withTiming(0, {duration: 0}),
              ),
        },
        {
          translateX: paymentLoading.success
            ? withDelay(
                delay,
                withSequence(
                  withTiming(CENTER_X, config),
                  withTiming(lastAxis.x, config),
                ),
              )
            : 0,
        },
        {
          translateY: paymentLoading.success
            ? withDelay(
                delay,
                withSequence(
                  withTiming(CENTER_Y, config),
                  withTiming(lastAxis.y, config),
                ),
              )
            : 0,
        },
      ],
      opacity: paymentLoading.opened
        ? withTiming(1, config)
        : withDelay(delay + config.duration, withTiming(0, config)),
      width: paymentLoading.success
        ? withDelay(delay, withTiming(CIRCLE_SIZE, config))
        : windowWidth,
      height: paymentLoading.success
        ? withDelay(delay, withTiming(CIRCLE_SIZE, config))
        : windowHeight,
    };
  }, [paymentLoading]);

  const boxStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: paymentLoading.opened
            ? 1
            : paymentLoading.success
            ? withSequence(
                withSpring(1.3),
                withSpring(1),
                withDelay(delay - 500, withTiming(0.5, config)),
              )
            : withSequence(withSpring(1.3), withSpring(1)),
        },
      ],
    };
  }, [paymentLoading]);

  const iconBoxStyle = useAnimatedStyle(() => {
    return {
      borderWidth: 3,
      borderColor: paymentLoading.success ? colors.green : colors.red,
      opacity: paymentLoading.opened ? 0 : withTiming(1, config),
    };
  }, [paymentLoading]);

  const titleStyle = useAnimatedStyle(() => {
    return {
      color: paymentLoading.success ? colors.green : colors.red,
      opacity: paymentLoading.opened
        ? 0
        : withSequence(withTiming(0, {duration: 0}), withTiming(1, config)),
    };
  }, [paymentLoading]);

  return (
    <Animated.View style={[styles.loadingPayment, paymentLoadingStyle]}>
      <View style={styles.loadingPayment__container}>
        <Animated.View style={[styles.loadingPayment__box, boxStyle]}>
          <Progress.Circle
            size={100}
            indeterminate={true}
            color={'grey'}
            borderWidth={3}
          />
          <Animated.View style={[styles.loadingPayment__iconBox, iconBoxStyle]}>
            <Entypo
              size={50}
              name={paymentLoading.success ? 'check' : 'cross'}
              color={paymentLoading.success ? colors.green : colors.red}
            />
          </Animated.View>
        </Animated.View>
        <Animated.Text style={[styles.loadingPayment__title, titleStyle]}>
          {paymentLoading.success ? 'Готово!' : 'Ошибка!'}
        </Animated.Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  loadingPayment: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: CIRCLE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },

  loadingPayment__container: {
    overflow: 'hidden',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingPayment__box: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 100,
  },

  loadingPayment__iconBox: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },

  loadingPayment__title: {
    position: 'absolute',
    fontSize: 25,
    paddingTop: 200,
  },
});

export default connect(mapStateToProps, null)(LoadingPayment);
