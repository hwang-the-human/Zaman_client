import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import Animated, {
  scrollTo,
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
  useAnimatedScrollHandler,
  useAnimatedRef,
  withRepeat,
} from 'react-native-reanimated';
import {PanGestureHandler} from 'react-native-gesture-handler';
import ShadowView from '../extensions/ShadowView';
import Prerequisites from './Prerequisites';
import {connect} from 'react-redux';
import {setBottomMenu} from '../../redux/Reducers';

function mapDispatchToProps(dispatch) {
  return {
    setBottomMenu: bottomMenu => dispatch(setBottomMenu(bottomMenu)),
  };
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const BOTTOM_MENU_HEIGHT = windowHeight * 0.8;

function BottomMenu({bottomMenu, setBottomMenu}) {
  const [opened, setOpened] = useState(true);
  const y = useSharedValue(BOTTOM_MENU_HEIGHT);
  const opacity = useSharedValue(0);

  function handleCloseBottomMenu() {
    setOpened(false);
  }

  function switchBottomMenuScreen() {
    switch (bottomMenu.screen) {
      case 'Prerequisites':
        return <Prerequisites dish={bottomMenu.data} setOpened={setOpened} />;
      default:
        return null;
    }
  }

  const config = {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };

  function closeBottomMenu() {
    setBottomMenu({screen: '', data: {}, opened: false});
  }

  useEffect(() => {
    if (opened) {
      opacity.value = withTiming(1, config);
      y.value = withTiming(0, config);
    } else {
      opacity.value = withTiming(0, config);
      y.value = withTiming(BOTTOM_MENU_HEIGHT, config, () => {
        runOnJS(closeBottomMenu)();
      });
    }
  }, [opened]);

  function updateCloseButtomMenu() {
    setOpened(false);
  }

  const panGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = y.value;
    },
    onActive: (e, ctx) => {
      if (ctx.startX + e.translationY > 0) {
        y.value = ctx.startX + e.translationY;
      } else {
        y.value = 0;
      }
    },
    onEnd: (e, ctx) => {
      if (e.velocityY < 600) {
        if (y.value > BOTTOM_MENU_HEIGHT - BOTTOM_MENU_HEIGHT * 0.8) {
          runOnJS(updateCloseButtomMenu)();
        } else {
          y.value = withTiming(0, config);
        }
      } else {
        runOnJS(updateCloseButtomMenu)();
      }
    },
  });

  const shadowScreenStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: 'rgba(0,0,0,0.3)',
      opacity: opacity.value,
    };
  }, [opacity.value]);

  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: y.value}],
    };
  }, [y.value]);

  const stickStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withRepeat(
            withSequence(
              withTiming(-5, {duration: 1000}),
              withTiming(5, {duration: 1000}),
            ),
            -1,
            true,
          ),
        },
      ],
    };
  }, []);

  return (
    <View style={styles.bottomMenu}>
      <TouchableWithoutFeedback onPress={handleCloseBottomMenu}>
        <Animated.View
          style={[styles.bottomMenu__shadowScreen, shadowScreenStyle]}
        />
      </TouchableWithoutFeedback>
      <PanGestureHandler
        onGestureEvent={panGestureHandler}
        failOffsetX={[-1, 1]}
        failOffsetY={-1}>
        <Animated.View style={[styles.bottomMenu__container, containerStyle]}>
          <View style={styles.bottomMenu__stickBox}>
            <Animated.View style={[styles.bottomMenu__stick, stickStyle]}>
              <View style={styles.bottomMenu__leftStick} />
              <View style={styles.bottomMenu__rightStick} />
            </Animated.View>
          </View>
          {switchBottomMenuScreen()}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomMenu: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },

  bottomMenu__shadowScreen: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  bottomMenu__container: {
    position: 'absolute',
    backgroundColor: 'white',
    width: '100%',
    height: BOTTOM_MENU_HEIGHT,
    bottom: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },

  bottomMenu__stickBox: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottomMenu__stick: {
    flexDirection: 'row',
  },

  bottomMenu__leftStick: {
    borderRadius: 40,
    backgroundColor: 'grey',
    transform: [{rotate: '30deg'}],
    width: 20,
    height: 5,
    left: 3,
  },

  bottomMenu__rightStick: {
    borderRadius: 40,
    backgroundColor: 'grey',
    transform: [{rotate: '-30deg'}],
    width: 20,
    height: 5,
    right: 3,
  },
});

export default connect(null, mapDispatchToProps)(BottomMenu);
