import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  useAnimatedScrollHandler,
  withSequence,
} from 'react-native-reanimated';
import DishItem from '../../../items/DishItem';
import BottomBar from './BottomBar';
import _ from 'lodash';
import DishItemSkeleton from '../../../skeletons/DishItemSkeleton';
import Info from './Info';

export default function ScrollList({
  cafe,
  opened,
  imageScale,
  imageOpacity,
  titleY,
  config,
  listRef,
  showCategoryBar,
  showHeader,
  dishes,
  showDishes,
  categoryBarList,
  listCategoryLayout,
  setListCategoryLayout,
}) {
  const yAxis = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: e => {
      const scale = 1.2 - e.contentOffset.y / 125;
      const opacity = -0.4 + e.contentOffset.y / 125;
      const y = 230 - e.contentOffset.y;

      yAxis.value = e.contentOffset.y - 165;

      if (e.contentOffset.y > 300) {
        showCategoryBar.value = true;
      } else {
        showCategoryBar.value = false;
      }

      if (scale > 1) {
        imageScale.value = scale;
      } else {
        imageScale.value = 1;
      }

      if (e.contentOffset.y >= 0) {
        if (y > 0) {
          titleY.value = y;
        } else {
          titleY.value = 0;
        }

        if (opacity < 1) {
          showHeader.value = false;
          if (opacity > 0) {
            imageOpacity.value = opacity;
          } else {
            imageOpacity.value = 0;
          }
        } else {
          showHeader.value = true;
          imageOpacity.value = 1;
        }
      }
    },
  });

  const imageSpace = useAnimatedStyle(() => {
    return {
      width: '100%',
      height: opened
        ? withSequence(withTiming(120, {duration: 0}), withTiming(275, config))
        : withTiming(120, config),
    };
  }, [opened]);

  function renderDishes() {
    if (showDishes) {
      var type = '';
      var showCategory = false;

      return dishes.map((dish, i) => {
        if (dishes[i].type !== type) {
          type = dishes[i].type;
          showCategory = true;
        } else {
          showCategory = false;
        }

        return (
          <View key={i}>
            {showCategory && (
              <Text style={[styles.list__title]}>{dish.type}</Text>
            )}
            <DishItem
              dish={dish}
              cafe_id={cafe._id}
              scrollRef={listRef}
              yAxis={yAxis}
              config={config}
            />
          </View>
        );
      });
    } else {
      return (
        <View style={styles.list__skeletonBox}>
          <DishItemSkeleton />
          <DishItemSkeleton />
          <DishItemSkeleton />
          <DishItemSkeleton />
        </View>
      );
    }
  }

  return (
    <Animated.ScrollView
      style={styles.list}
      ref={listRef}
      onScroll={scrollHandler}
      scrollEnabled={opened ? true : false}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}>
      <Animated.View style={[imageSpace]} />

      <View style={styles.list__container}>
        <BottomBar cafe={cafe} />

        <Info cafe={cafe} />

        {renderDishes()}

        <View style={styles.list__space} />
      </View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  list: {
    height: '100%',
  },

  list__container: {
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
  },

  list__skeletonBox: {
    marginTop: 90,
  },

  list__title: {
    fontSize: 25,
    fontWeight: '600',
    marginTop: 60,
    marginLeft: 15,
    marginBottom: 15,
  },

  list__space: {
    width: '100%',
    height: 300,
  },
});
