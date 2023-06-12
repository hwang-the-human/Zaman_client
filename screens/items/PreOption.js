import React from 'react';
import {StyleSheet, Text, View, TouchableWithoutFeedback} from 'react-native';
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
} from 'react-native-reanimated';
import colors from '../extensions/Colors';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import _ from 'lodash';

export default function PreOption({
  isAdded,
  data,
  prerequisites,
  max,
  setPrerequisites,
  buttonValue,
  isDisabled,
  count,
  setCount,
}) {
  function handleAddOption() {
    if (isAdded.value) {
      isAdded.value = false;
      setPrerequisites(
        _.remove(prerequisites, a => {
          return a.title !== data.title;
        }),
      );
      setCount(--count);
    } else {
      isAdded.value = true;
      const array = [...prerequisites, data];
      setPrerequisites([...prerequisites, data]);
      setCount(++count);
    }

    if (count < max) {
      isDisabled.value = false;
    } else {
      isDisabled.value = true;
    }

    buttonValue.value = withSequence(
      withSpring(1),
      withSpring(1.1),
      withSpring(1),
    );
  }

  const preOptionStyle = useAnimatedStyle(() => {
    return {
      opacity: isDisabled.value && !isAdded.value ? 0.5 : 1,
    };
  });

  const textBoxStyle = useAnimatedStyle(() => {
    return {
      fontWeight: isAdded.value ? 'bold' : '400',
    };
  });

  const buttonPlusStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: !isAdded.value ? withSpring(1) : 0}],
    };
  });

  const buttonCheckStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      transform: [{scale: isAdded.value ? withSpring(1) : 0}],
    };
  });
  return (
    <TouchableWithoutFeedback
      onPress={handleAddOption}
      disabled={isDisabled.value && !isAdded.value ? true : false}>
      <Animated.View style={[styles.preOption, preOptionStyle]}>
        <Animated.Text style={[styles.preOption__textBox, textBoxStyle]}>
          <Text style={styles.preOption__title}>{data.title}</Text>
          {'    '}
          {data.price > 0 && (
            <Text style={styles.preOption__priceText}>+{data.price} тг.</Text>
          )}
        </Animated.Text>
        <View style={styles.preOption__buttonBox}>
          <Animated.View style={[styles.preOption__button, buttonPlusStyle]}>
            <Entypo name="plus" size={20} color={colors.green} />
          </Animated.View>
          <Animated.View style={[styles.preOption__button, buttonCheckStyle]}>
            <Entypo name="check" size={20} color={colors.green} />
          </Animated.View>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  preOption: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 15,
  },

  preOption__textBox: {
    flexDirection: 'row',
    fontSize: 16,
  },

  preOption__title: {},

  preOption__priceText: {
    color: colors.green,
  },

  preOption__buttonBox: {},

  preOption__button: {
    backgroundColor: colors.lightGreen,
    width: 25,
    height: 25,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
