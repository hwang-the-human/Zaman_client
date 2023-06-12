import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  runOnJS,
  Easing,
  withTiming,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import colors from '../extensions/Colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {connect} from 'react-redux';
import Header from './Header';
import ScrollList from './ScrollList';
import {setLastAxisTrack} from '../../redux/Reducers';

function mapStateToProps(state) {
  return {
    lastAxis: state.lastAxisTrackReducer,
    trackedOrders: state.trackedOrdersReducer,
    paymentLoading: state.paymentLoadingReducer,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setLastAxisTrack: (x, y) => dispatch(setLastAxisTrack(x, y)),
  };
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const CIRCLE_SIZE = 50;
const CENTER_X = windowWidth / 2 - CIRCLE_SIZE / 2;
const CENTER_Y = windowHeight / 2 - CIRCLE_SIZE / 2;

function Track({lastAxis, setLastAxisTrack, trackedOrders, paymentLoading}) {
  const x = useSharedValue(windowWidth - CIRCLE_SIZE);
  const y = useSharedValue(CENTER_Y);
  const [opened, setOpened] = useState(false);

  function handleOpen() {
    setOpened(opened ? false : true);
  }

  function updateOpened() {
    setOpened(false);
  }

  function updateAxis(x) {
    setLastAxisTrack(x, y.value);
  }

  const panGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = x.value;
      ctx.startY = y.value;
    },
    onActive: (e, ctx) => {
      x.value = e.translationX + ctx.startX;
      y.value = e.translationY + ctx.startY;
    },
    onEnd: (e, ctx) => {
      if (opened) {
        if (Math.abs(e.velocityX) < 600) {
          if (x.value > windowWidth / 4) {
            runOnJS(updateOpened)();
          } else {
            x.value = withTiming(0, config);
            y.value = withTiming(0, config);
          }
        } else {
          runOnJS(updateOpened)();
        }
      } else {
        if (Math.abs(e.velocityX) < 600) {
          if (x.value > CENTER_X) {
            x.value = withSpring(windowWidth - CIRCLE_SIZE);
            runOnJS(updateAxis)(windowWidth - CIRCLE_SIZE);
          } else {
            x.value = withSpring(0);
            runOnJS(updateAxis)(0);
          }
        } else {
          if (x.value > CENTER_X) {
            runOnJS(updateAxis)(0);
            x.value = withSpring(0);
          } else {
            runOnJS(updateAxis)(windowWidth - CIRCLE_SIZE);
            x.value = withSpring(windowWidth - CIRCLE_SIZE);
          }
        }
      }
    },
  });

  const config = {
    duration: 300,
    // easing: Easing.bezier(0.5, 0.01, 0, 1),
  };

  const width = useSharedValue(CIRCLE_SIZE);
  const height = useSharedValue(CIRCLE_SIZE);

  useEffect(() => {
    if (opened) {
      x.value = withSequence(
        withTiming(CENTER_X, config),
        withTiming(0, config),
      );
      y.value = withSequence(
        withTiming(CENTER_Y, config),
        withTiming(0, config),
      );

      width.value = withDelay(config.duration, withTiming(windowWidth, config));
      height.value = withDelay(
        config.duration,
        withTiming(windowHeight, config),
      );
    } else {
      if (lastAxis.y !== 0) {
        x.value = withSequence(
          withTiming(CENTER_X, config),
          withTiming(lastAxis.x, config),
        );
        y.value = withSequence(
          withTiming(CENTER_Y, config),
          withTiming(lastAxis.y, config),
        );
      } else {
        setLastAxisTrack(x.value, y.value);
      }

      width.value = withTiming(CIRCLE_SIZE, config);
      height.value = withTiming(CIRCLE_SIZE, config);
    }
  }, [opened]);

  const trackStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: x.value}, {translateY: y.value}],
      width: width.value,
      height: height.value,
    };
  }, [width, height, x.value, y.value, trackedOrders]);

  const delay = 3000;

  // setPaymentLoading(false, true);

  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale:
            trackedOrders.length > 0
              ? !paymentLoading.opened && paymentLoading.success
                ? withSequence(
                    withTiming(1, {duration: 0}),
                    withDelay(
                      delay + config.duration * 2,
                      withSequence(withTiming(1.3), withTiming(1)),
                    ),
                  )
                : 1
              : 0,
        },
      ],
    };
  }, [paymentLoading, trackedOrders]);

  const iconStyle = useAnimatedStyle(() => {
    return {
      opacity: opened
        ? withDelay(config.duration, withTiming(0, config))
        : withTiming(1, config),
      transform: [
        {
          scale: opened
            ? withDelay(config.duration, withTiming(0, config))
            : withTiming(1, config),
        },
      ],
    };
  }, [opened]);

  return (
    <PanGestureHandler
      onGestureEvent={panGestureHandler}
      // failOffsetX={opened ? -1 : 1}
      // failOffsetY={opened ? [-1, 0] : 1}
    >
      <Animated.View style={[styles.track, trackStyle]}>
        <Animated.View style={[styles.track__container, containerStyle]}>
          <View style={styles.track__subContainer}>
            <Header setOpened={setOpened} opened={opened} config={config} />
            <ScrollList trackedOrders={trackedOrders} />
          </View>
          <Animated.View style={[styles.track__icon, iconStyle]}>
            <TouchableWithoutFeedback onPress={handleOpen}>
              <MaterialIcons
                name="delivery-dining"
                size={30}
                color={colors.green}
              />
            </TouchableWithoutFeedback>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  track: {
    position: 'absolute',
    borderRadius: CIRCLE_SIZE,
  },

  track__container: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: CIRCLE_SIZE,
    width: '100%',
    height: '100%',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },

  track__subContainer: {
    overflow: 'hidden',
    width: '100%',
    height: '100%',
  },

  track__icon: {
    backgroundColor: 'white',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Track);
