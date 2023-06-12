import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import Animated, {
  scrollTo,
  useSharedValue,
  useAnimatedStyle,
  Easing,
  withTiming,
  useAnimatedScrollHandler,
  useAnimatedRef,
} from 'react-native-reanimated';
import colors from '../../extensions/Colors';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import _ from 'lodash';

export default function CategoryBar({isTop_list, setCategoryTitle}) {
  const windowWidth = Dimensions.get('window').width;
  const horizontalRef = useAnimatedRef();
  const selectedCategory = useSharedValue(0);
  const [categoryItemsLayout, setCategoryItemsLayout] = useState([]);

  const categoryItems = [
    {
      title: 'Все',
      icon: 'dots-horizontal',
    },

    {
      title: 'Азиатская',
      icon: 'noodles',
    },
    {
      title: 'Акции',
      icon: 'cash-plus',
    },
    {
      title: 'Восточная',
      icon: 'pot-steam',
    },
    {
      title: 'Европейская',
      icon: 'food-croissant',
    },
    {
      title: 'Десерты',
      icon: 'ice-cream',
    },
    {
      title: 'Фаст-фуд',
      icon: 'hamburger',
    },
  ];

  function handleSelectCategory(category, index) {
    const x =
      categoryItemsLayout[index].x -
      windowWidth / 2 +
      categoryItemsLayout[index].width / 2;

    selectedCategory.value = index;
    horizontalRef.current.scrollTo({
      y: 0,
      x: x,
      animated: true,
    });

    setCategoryTitle(category.title);
  }

  function scrollToNearestItem(minDistance) {
    'worklet';

    var toScroll;
    const center = minDistance + windowWidth / 2;

    const closestItem = categoryItemsLayout.reduce((a, b) => {
      return Math.abs(b.x - center) < Math.abs(a.x + a.width - center) ? b : a;
    });
    toScroll = closestItem.x - (windowWidth / 2 - closestItem.width / 2);

    scrollTo(horizontalRef, toScroll, 0, true);
  }

  const horizontalScrollHandler = useAnimatedScrollHandler({
    onEndDrag: e => {
      if (e.velocity.x === 0) {
        scrollToNearestItem(e.contentOffset.x);
      }
    },
  });

  const config = {
    duration: 300,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };

  const categoryBarStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(isTop_list.value ? 120 : 30, config),
        },
      ],
    };
  }, [isTop_list.value]);

  return (
    <Animated.View style={[styles.categoryBar, categoryBarStyle]}>
      <Animated.ScrollView
        ref={horizontalRef}
        showsHorizontalScrollIndicator={false}
        onScroll={horizontalScrollHandler}
        horizontal={true}
        scrollEventThrottle={16}>
        {categoryItems.map((category, index) => {
          const iconStyle = useAnimatedStyle(() => {
            return {
              backgroundColor:
                selectedCategory.value === index
                  ? colors.green
                  : colors.lightGreen,
            };
          });

          const titleStyle = useAnimatedStyle(() => {
            return {
              fontWeight: selectedCategory.value === index ? 'bold' : '400',
            };
          });
          return (
            <View
              style={styles.categoryBar__option}
              key={index}
              onLayout={e => {
                if (categoryItemsLayout.length < categoryItems.length) {
                  setCategoryItemsLayout(
                    [
                      ...categoryItemsLayout,
                      {
                        ...e.nativeEvent.layout,
                      },
                    ].sort((a, b) => (a.x > b.x ? 1 : -1)),
                  );
                }
              }}>
              <TouchableWithoutFeedback
                onPress={() => handleSelectCategory(category, index)}>
                <Animated.View style={[styles.categoryBar__icon, iconStyle]}>
                  <MaterialCommunityIcons
                    name={category.icon}
                    size={30}
                    color={selectedCategory.value === index ? 'black' : 'grey'}
                  />
                </Animated.View>
              </TouchableWithoutFeedback>
              <Animated.Text style={[styles.categoryBar__title, titleStyle]}>
                {category.title}
              </Animated.Text>
            </View>
          );
        })}
      </Animated.ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  categoryBar: {
    position: 'absolute',
    width: '100%',
    paddingBottom: 15,

    borderBottomWidth: 1,
    borderBottomColor: colors.grey,

    backgroundColor: 'white',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 4,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 4.65,
    // elevation: 8,
  },

  categoryBar__option: {
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 75,
    marginLeft: 15,
    marginRight: 15,
  },

  categoryBar__icon: {
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  categoryBar__title: {},
});
