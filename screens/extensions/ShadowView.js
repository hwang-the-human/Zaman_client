import React from 'react';
import {StyleSheet, View, TouchableWithoutFeedback} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
} from 'react-native-reanimated';

export default function ShadowView({opened, disabled, children}) {
  function handleClose() {
    if (!disabled) {
      opened.value = false;
    }
  }

  const config = {
    duration: 300,
  };

  const shadowViewStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: 'rgba(0,0,0,0.3)',
      opacity: opened.value
        ? withSequence(withTiming(0, {duration: 0}), withTiming(1, config))
        : withTiming(0, config),
      transform: [
        {
          scale: opened.value
            ? 1
            : withDelay(config.duration, withTiming(0, {duration: 0})),
        },
      ],
    };
  }, [opened.value]);

  return (
    <Animated.View style={[styles.shadowView, shadowViewStyle]}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.shadowView_closeButton} />
      </TouchableWithoutFeedback>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  shadowView: {
    zIndex: 100,
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  shadowView_closeButton: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});
