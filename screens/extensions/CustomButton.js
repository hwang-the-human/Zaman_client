import React from 'react';
import {StyleSheet} from 'react-native';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  runOnJS,
} from 'react-native-reanimated';
import {TapGestureHandler} from 'react-native-gesture-handler';

export default function CustomButton({
  handleButton,
  disabled,
  style,
  children,
}) {
  const buttonScale = useSharedValue(1);

  const tapGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      if (!disabled) {
        buttonScale.value = withSpring(0.9);
      }
    },
    onFail: (e, ctx) => {
      if (!disabled) {
        buttonScale.value = withSpring(1);
      }
    },
    onEnd: _ => {
      if (!disabled) {
        buttonScale.value = withSpring(1);
        runOnJS(handleButton)();
      }
    },
  });

  const buttonStyle = useAnimatedStyle(() => {
    return {
      opacity: disabled ? 0.5 : 1,
      transform: [
        {
          scale: buttonScale.value,
        },
      ],
    };
  }, [buttonScale.value, disabled]);

  return (
    <TapGestureHandler
      onGestureEvent={tapGestureHandler}
      shouldCancelWhenOutside={true}>
      <Animated.View style={[style, buttonStyle]}>{children}</Animated.View>
    </TapGestureHandler>
  );
}

const styles = StyleSheet.create({});
