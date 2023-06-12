import React, {useEffect} from 'react';
import {StyleSheet, View, Image} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

export default function ImageBar({
  image,
  opened,
  imageScale,
  imageOpacity,
  config,
}) {
  const height = useSharedValue(120);

  useEffect(() => {
    if (opened) {
      imageScale.value = withTiming(1.2, config);
      height.value = withTiming(250, config);
    } else {
      imageScale.value = withTiming(1, config);
      height.value = withTiming(120, config);
    }
  }, [opened]);

  const imageBarStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      transform: [{scale: imageScale.value}],
      height: height.value,
      width: '100%',
    };
  }, []);

  const shadowStyle = useAnimatedStyle(() => {
    return {
      opacity: imageOpacity.value,
    };
  });

  return (
    <Animated.View style={imageBarStyle}>
      <Image
        style={styles.imageBar__image}
        source={{
          uri: image,
        }}
      />
      <View style={styles.imageBar__defaultShadow} />
      <Animated.View style={[styles.imageBar__shadow, shadowStyle]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  imageBar__image: {
    width: '100%',
    height: '100%',
  },

  imageBar__defaultShadow: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.1)',
    width: '100%',
    height: '100%',
  },

  imageBar__shadow: {
    position: 'absolute',
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
  },
});
