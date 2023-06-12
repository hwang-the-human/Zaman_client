import React, {useState} from 'react';
import {StyleSheet, View, TouchableWithoutFeedback, Text} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withTiming,
  withSequence,
  withDelay,
  useAnimatedRef,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import DishItem from '../../../items/DishItem';
import SearchBar from './SearchBar';
import _ from 'lodash';

export default function SearchedList({
  cafe,
  searchedListOpened,
  setSearchedListOpened,
  config,
  dishes,
}) {
  const [searchedDishes, setSearchedDishes] = useState([]);
  const searchedListRef = useAnimatedRef();
  const opened = useSharedValue(true);
  const textIsEmpty = useSharedValue(true);
  const [searching, setSearching] = useState(false);

  const textInputRef = useAnimatedRef();
  const yAxis = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: e => {
      yAxis.value = e.contentOffset.y - 100;
    },
  });

  function handleCloseScreen() {
    setSearching(false);
    textIsEmpty.value = true;
    textInputRef.current.clear();
    textInputRef.current.blur();
    opened.value = false;
  }

  function updateSearchedListOpened() {
    setSearchedListOpened(false);
  }

  const searchedListStyle = useAnimatedStyle(() => {
    return {
      opacity: opened.value
        ? withSequence(withTiming(0, {duration: 0}), withTiming(1, config))
        : withDelay(
            config.duration,
            withTiming(0, config, () => {
              runOnJS(updateSearchedListOpened)();
            }),
          ),
    };
  }, [opened.value]);

  const closeButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: searchedDishes.length > 0 ? 0 : 1}],
    };
  }, [searchedDishes.length]);

  return (
    <Animated.View style={[styles.searchedList, searchedListStyle]}>
      <View style={styles.searchedList__header}>
        <SearchBar
          searchedListOpened={searchedListOpened}
          opened={opened}
          textInputRef={textInputRef}
          handleCloseScreen={handleCloseScreen}
          setDishes={setSearchedDishes}
          dishes={dishes}
          textIsEmpty={textIsEmpty}
          setSearching={setSearching}
          searching={searching}
          config={config}
        />
      </View>
      <View style={styles.searchedList__scrollView}>
        <Animated.ScrollView
          ref={searchedListRef}
          onScroll={scrollHandler}
          scrollEventThrottle={16}>
          {searchedDishes.map((dish, i) => (
            <DishItem
              dish={dish}
              cafe_id={cafe._id}
              scrollRef={searchedListRef}
              yAxis={yAxis}
              config={config}
              key={i}
            />
          ))}
          <View style={styles.searchedList__space} />
        </Animated.ScrollView>
        <TouchableWithoutFeedback onPress={handleCloseScreen}>
          <Animated.View
            style={[styles.searchedList__closeButton, closeButtonStyle]}>
            {searching && (
              <Text style={styles.searchedList__title}>Ничего не найдено.</Text>
            )}
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  searchedList: {
    position: 'absolute',
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
    zIndex: 2,
  },

  searchedList__header: {
    height: 100,
    borderBottomColor: 'grey',
    borderBottomWidth: 0.2,
  },

  searchedList__scrollView: {
    height: '100%',
    width: '100%',
  },

  searchedList__closeButton: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  searchedList__title: {
    fontSize: 25,
    marginBottom: 200,
    color: 'grey',
  },

  searchedList__space: {
    width: '100%',
    height: 300,
  },
});
