import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  Easing,
  withTiming,
  withDelay,
  useAnimatedScrollHandler,
  useAnimatedRef,
} from 'react-native-reanimated';
import SearchBar from '../home/SearchBar';
import OptionItem from '../../items/OptionItem';
import CategoryBar from './CategoryBar';
import Cafe from './cafe/Cafe';
import * as Progress from 'react-native-progress';
import colors from '../../extensions/Colors';
import axios from 'axios';
import api from '../../extensions/Api';
import _ from 'lodash';
import LoadingSearch from '../../extensions/LoadingSearch';

const windowHeight = Dimensions.get('window').height;

export default function HeaderHome({
  yAxis,
  isTop_list,
  isFocused,
  setIsFocused,
  cafeOpened,
  setCategoryTitle,
}) {
  const [searchedCafeItems, setSearchedCafeItems] = useState([]);
  const searchedCafeCount = useSharedValue(0);

  const [openOptions, setOpenOptions] = useState(false);
  const inputText = useSharedValue('');
  const textInputRef = useAnimatedRef();
  const [loading, setLoading] = useState({show: false, success: false});

  const textIsEmpty = useSharedValue(true);
  const yAxis2 = useSharedValue(0);
  const prevMaxHeight = useSharedValue(0);

  const optionsArray = [
    'бургер',
    'донер',
    'кебаб',
    'десерты',
    'салат',
    'суп',
    'лагман',
    'плов',
    'манты',
    'шашлык',
    'пельмени',
    'пицца',
  ];

  const verticalScrollHandler = useAnimatedScrollHandler({
    onScroll: (e, context) => {
      yAxis2.value = e.contentOffset.y;
      const scrollCenter = e.contentSize.height - windowHeight;

      if (
        e.contentOffset.y >= scrollCenter &&
        prevMaxHeight.value !== e.contentSize.height
      ) {
        prevMaxHeight.value = e.contentSize.height;
        if (isFocused) {
          runOnJS(updateCafeBySearch)();
        }
      }
    },
  });

  function handleSearch(input) {
    if (input !== '') {
      setOpenOptions(false);
      textInputRef.current.blur();
      getCafeBySearch(input);
    }
  }

  function handleUnfocus() {
    setSearchedCafeItems([]);
    setIsFocused(false);
    setOpenOptions(false);
    textInputRef.current.blur();
    isTop_list.value = withDelay(600, withTiming(true, {duration: 0}));
    setLoading({show: false, success: false});
  }

  async function getCafeBySearch(input) {
    setLoading({show: true, success: true});
    searchedCafeCount.value = 0;
    try {
      const response = await axios.get(
        api.restaurants.get_list_of_restaurants,
        {
          params: {
            title: input,
            itemCount: 0,
          },
        },
      );

      if (response.data.length > 0) {
        setSearchedCafeItems(response.data);
        searchedCafeCount.value = 5;
        setLoading({show: false, success: true});
      } else {
        setLoading({show: true, success: false});
      }
    } catch (error) {
      console.log('Could not get Restaurants', error);
    }
  }

  async function updateCafeBySearch() {
    try {
      const response = await axios.get(
        api.restaurants.get_list_of_restaurants,
        {
          params: {
            title: inputText.value,
            itemCount: searchedCafeCount.value,
          },
        },
      );

      setSearchedCafeItems(_.concat(searchedCafeItems, response.data));
      searchedCafeCount.value = searchedCafeCount.value + 5;
    } catch (error) {
      console.log('Could not get Restaurants', error);
    }
  }

  const config = {
    duration: 300,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };

  const headerHomeStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: yAxis.value}],
      height: isFocused
        ? windowHeight
        : withDelay(config.duration, withTiming(120, {duration: 0})),
      backgroundColor: withTiming(
        isFocused ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0)',
        config,
      ),
    };
  }, [yAxis.value, isFocused]);

  const barStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: yAxis2.value}],
    };
  }, [yAxis2.value]);

  return (
    <Animated.View style={[styles.headerHome, headerHomeStyle]}>
      <CategoryBar
        isTop_list={isTop_list}
        setCategoryTitle={setCategoryTitle}
      />
      <Animated.ScrollView
        style={styles.headerHome__scroll}
        onScroll={verticalScrollHandler}
        scrollEnabled={cafeOpened ? false : true}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        scrollEventThrottle={16}>
        <Animated.View style={[styles.headerHome__bar, barStyle]}>
          {optionsArray.map((title, index) => (
            <OptionItem
              title={title}
              openOptions={openOptions}
              setOpenOptions={setOpenOptions}
              textIsEmpty={textIsEmpty}
              handleSearch={handleSearch}
              inputText={inputText}
              key={index}
            />
          ))}

          <View
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundColor: 'white',
            }}
          />

          <SearchBar
            textInputRef={textInputRef}
            isFocused={isFocused}
            setIsFocused={setIsFocused}
            setOpenOptions={setOpenOptions}
            handleSearch={handleSearch}
            isTop_list={isTop_list}
            textIsEmpty={textIsEmpty}
            inputText={inputText}
            handleUnfocus={handleUnfocus}
            setCafeItems={setSearchedCafeItems}
          />
        </Animated.View>

        <LoadingSearch loading={loading} handlePress={handleUnfocus} />

        {searchedCafeItems.length < 1 && openOptions && (
          <TouchableWithoutFeedback onPress={handleUnfocus}>
            <View style={[styles.headerHome__closeTap]} />
          </TouchableWithoutFeedback>
        )}

        <View style={styles.headerHome__space} />

        {searchedCafeItems.map((cafe, i) => (
          <Cafe yAxis={yAxis2} cafe={cafe} key={i} />
        ))}

        {searchedCafeItems.length > 4 && (
          <View style={styles.headerHome__progress}>
            <Progress.Circle
              size={50}
              indeterminate={true}
              color={colors.green}
              borderWidth={3}
            />
          </View>
        )}
      </Animated.ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  headerHome: {
    position: 'absolute',
    width: '100%',
    zIndex: 2,
  },

  headerHome__scroll: {
    height: '100%',
    width: '100%',
    overflow: 'visible',
  },

  headerHome__bar: {
    height: 120,
    zIndex: 2,
    alignItems: 'flex-end',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },

  headerHome__closeTap: {
    position: 'absolute',
    width: '100%',
    height: windowHeight,
  },

  headerHome__space: {
    width: '100%',
    height: 30,
    alignItems: 'center',
  },

  headerHome__progress: {
    width: '100%',
    height: 100,
    alignItems: 'center',
  },
});
