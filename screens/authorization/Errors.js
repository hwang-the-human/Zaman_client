import React, {useState} from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import colors from '../extensions/Colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Animated, {
  useAnimatedStyle,
  withTiming,
  Easing,
  withSequence,
} from 'react-native-reanimated';

const windowWidth = Dimensions.get('window').width;

export default function Errors({errors}) {
  const [errorsHeight, setErrorsHeight] = useState(0);

  const config = {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };

  const errorsStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: errorsHeight !== 0 ? 1 : 0}],
      opacity: withSequence(
        withTiming(0, {duration: 0}),
        withTiming(1, config),
      ),
    };
  }, [errorsHeight]);
  const emptyBoxStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(errorsHeight, config),
    };
  }, [errorsHeight]);

  return (
    <Animated.View style={[styles.errors, errorsStyle]}>
      <View style={styles.errors__container}>
        <Animated.View style={emptyBoxStyle} />
        <View
          style={styles.errors__subContainer}
          onLayout={event => {
            setErrorsHeight(event.nativeEvent.layout.height);
          }}>
          {errors.map((error, i) => (
            <View style={styles.errors_sectionBox} key={i}>
              <View style={styles.errors__section}>
                <MaterialIcons
                  style={styles.errors__icon}
                  name="error-outline"
                  size={30}
                  color="black"
                />
                <Text style={styles.errors__title}>{error.message}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  errors: {
    alignItems: 'center',
  },

  errors__container: {
    width: windowWidth - 30,
  },

  errors__subContainer: {
    position: 'absolute',
    width: '100%',
  },

  errors_sectionBox: {
    alignItems: 'center',
    marginTop: 15,
  },

  errors__section: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  errors__icon: {
    marginRight: 15,
  },

  errors__title: {
    flex: 1,
    fontWeight: '500',
    fontSize: 16,
    color: colors.red,
  },
});
