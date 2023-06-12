import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';
import colors from '../Colors';
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

export default function CafeCategory({
  categoryItems,
  categoryLayout,
  setCategoryLayout,
}) {
  const windowWidth = Dimensions.get('window').width;
  const horizontalRef = useAnimatedRef();
  const selectedCategory = useSharedValue({x: 0, width: 0, index: 0});

  function handleSelectCategory(index) {
    selectedCategory.value = {
      x: categoryLayout[index].x,
      width: categoryLayout[index].width,
      index: index,
    };
    horizontalRef.current.scrollTo({
      y: 0,
      x:
        categoryLayout[index].x -
        (windowWidth / 2 - categoryLayout[index].width / 2),
      animated: true,
    });
  }

  function scrollToNearestItem(minDistance) {
    'worklet';

    var toScroll;
    const center = minDistance + windowWidth / 2;

    const closestItem = categoryLayout.reduce((a, b) => {
      return Math.abs(b.x - center) < Math.abs(a.x + a.width - center) ? b : a;
    });

    toScroll = closestItem.x - (windowWidth / 2 - closestItem.width / 2);

    scrollTo(horizontalRef, toScroll, 0, true);
  }

  const horizontalScrollHandler = useAnimatedScrollHandler({
    onScroll: e => {
      // scrollValue.value = e.contentOffset.x;
    },
    onEndDrag: e => {
      if (e.velocity.x === 0) {
        scrollToNearestItem(e.contentOffset.x);
      }
    },
    onMomentumEnd: e => {
      if (
        e.contentOffset.x !== 0 &&
        e.contentOffset.x !== e.contentSize.width - windowWidth
      ) {
        scrollToNearestItem(e.contentOffset.x);
      }
    },
  });

  const selectedCategoryStyle = useAnimatedStyle(() => {
    if (
      selectedCategory.value.width === 0 &&
      categoryLayout.length === categoryItems.length
    ) {
      selectedCategory.value = categoryLayout[0];
    }

    return {
      position: 'absolute',
      alignSelf: 'center',
      backgroundColor: 'rgba(168, 238, 144, 0.3)',
      height: 35,
      borderRadius: selectedCategory.value.width / 3,
      width: withTiming(selectedCategory.value.width, {duration: 200}),
      transform: [
        {
          translateX: withTiming(selectedCategory.value.x, {
            duration: 200,
          }),
        },
      ],
    };
  });

  return (
    <Animated.ScrollView
      style={styles.cafe__horizontalScroll}
      ref={horizontalRef}
      showsHorizontalScrollIndicator={false}
      onScroll={horizontalScrollHandler}
      horizontal={true}
      scrollEventThrottle={16}>
      {categoryItems.map((item, index) => {
        const selectedCategoryTextStyle = useAnimatedStyle(() => {
          return {
            fontSize: 18,
            color: selectedCategory.value.index === index ? 'green' : 'black',
          };
        });

        return (
          <TouchableWithoutFeedback
            onPress={() => handleSelectCategory(index)}
            key={index}>
            <View
              style={styles.cafeCategory__option}
              onLayout={e => {
                if (categoryLayout.length <= categoryItems.length) {
                  setCategoryLayout(
                    [
                      ...categoryLayout,
                      {...e.nativeEvent.layout, index: index},
                    ].sort((a, b) => (a.x > b.x ? 1 : -1)),
                  );
                }
              }}>
              <Animated.Text style={selectedCategoryTextStyle}>
                {item}
              </Animated.Text>
            </View>
          </TouchableWithoutFeedback>
        );
      })}
      <Animated.View style={selectedCategoryStyle} />
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  cafeCategory: {
    height: '100%',
    width: '100%',
  },

  cafeCategory__option: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    borderRadius: 100,
    marginLeft: 15,
    marginRight: 15,
    paddingLeft: 15,
    paddingRight: 15,
  },
});
