import React, {useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  withSpring,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withDelay,
  runOnJS,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {TapGestureHandler} from 'react-native-gesture-handler';

export default function HeaderButton({
  icon,
  handleClick,
  opened,
  config,
  delay,
}) {
  const buttonScale = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);

  const panGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      buttonScale.value = withSpring(0.9);
    },
    onFail: (e, ctx) => {
      buttonScale.value = withSpring(1);
    },
    onEnd: _ => {
      buttonScale.value = withSpring(1);
      runOnJS(handleClick)();
    },
  });

  useEffect(() => {
    if (opened) {
      buttonScale.value = withDelay(delay, withSpring(1));
      buttonOpacity.value = withDelay(delay, withSpring(1));
    } else {
      buttonScale.value = withTiming(0, config);
      buttonOpacity.value = withTiming(0, config);
    }
  }, [opened]);

  const headerButtonStyle = useAnimatedStyle(() => {
    return {
      opacity: buttonOpacity.value,
      transform: [
        {
          scale: buttonScale.value,
        },
      ],
    };
  }, [opened, buttonScale.value]);

  return (
    <TapGestureHandler
      onGestureEvent={panGestureHandler}
      shouldCancelWhenOutside={true}>
      <Animated.View style={[styles.headerButton, headerButtonStyle]}>
        {icon}
      </Animated.View>
    </TapGestureHandler>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    alignSelf: 'center',
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 40,
  },
});
