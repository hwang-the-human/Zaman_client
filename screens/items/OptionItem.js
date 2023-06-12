import React, {useState} from 'react';
import {StyleSheet, Text, View, TouchableWithoutFeedback} from 'react-native';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  runOnJS,
  Easing,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import colors from '../extensions/Colors';

export default function OptionItem({
  title,
  openOptions,
  textIsEmpty,
  inputText,
  handleSearch,
  setOpenOptions,
}) {
  const [position, setPosition] = useState({x: 0, y: 0});
  const [pressed, setPressed] = useState(false);

  function handleSelectOption() {
    setPressed(true);
    setOpenOptions(false);
  }

  const config = {
    duration: 300,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };

  const delay = 500;

  function lol() {
    handleSearch(title);
    setPressed(false);
    inputText.value = title;
    textIsEmpty.value = false;
  }

  const optionItemStyle = useAnimatedStyle(() => {
    const randomNumber = Math.random() * 300;

    return {
      zIndex: pressed ? 1 : 0,
      opacity: pressed
        ? withDelay(
            delay,
            withTiming(0, {duration: config.duration * 2}, () => {
              runOnJS(lol)();
            }),
          )
        : 1,
      transform: [
        {
          translateY: pressed
            ? withDelay(delay, withTiming(-position.y + 70, config))
            : withDelay(randomNumber, withSpring(openOptions ? 150 : -15)),
        },
        {
          translateX: withDelay(
            delay,
            withTiming(pressed ? -position.x + 85 : 0, config),
          ),
        },
        // {scale: withSpring(pressed ? 1.2 : 1)},
      ],
    };
  });

  return (
    <TouchableWithoutFeedback onPress={handleSelectOption}>
      <Animated.View
        style={[styles.optionItem, optionItemStyle]}
        onLayout={event => {
          setPosition({
            x: event.nativeEvent.layout.x,
            y: event.nativeEvent.layout.y,
          });
        }}>
        <Text style={styles.optionItem__title}>{title}</Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  optionItem: {
    alignContent: 'center',
    justifyContent: 'center',
    height: 30,
    backgroundColor: colors.green,
    borderRadius: 10,
    marginBottom: 15,
    marginLeft: 10,
    marginRight: 10,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },

  optionItem__title: {
    color: 'white',
    paddingLeft: 8,
    paddingRight: 8,
  },
});
