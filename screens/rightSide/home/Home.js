import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Dimensions, StatusBar} from 'react-native';
import Animated, {
  useSharedValue,
  runOnJS,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import {connect} from 'react-redux';
import HeaderHome from './HeaderHome';
import axios from 'axios';
import _ from 'lodash';
import api from '../../extensions/Api';
import Cafe from './cafe/Cafe';
import LoadingSearch from '../../extensions/LoadingSearch';
import * as Progress from 'react-native-progress';
import colors from '../../extensions/Colors';

function mapStateToProps(state) {
  return {
    cafeOpened: state.cafeOpenedReducer,
  };
}

const windowHeight = Dimensions.get('window').height;

function Home({cafeOpened}) {
  const [cafeItems, setCafeItems] = useState([]);
  const cafeCount = useSharedValue(0);
  const [categoryTitle, setCategoryTitle] = useState('Все');
  const [loading, setLoading] = useState({show: false, success: false});

  const isTop_list = useSharedValue(true);
  const [isFocused, setIsFocused] = useState(false);
  const lastY = useSharedValue(0);
  const yAxis = useSharedValue(0);
  const prevMaxHeight = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: e => {
      yAxis.value = e.contentOffset.y;
      if (e.contentOffset.y < 90) {
        isTop_list.value = true;
      } else {
        if (lastY.value >= e.contentOffset.y) {
          lastY.value = e.contentOffset.y;
          isTop_list.value = true;
        } else {
          lastY.value = e.contentOffset.y;
          isTop_list.value = false;
        }
      }

      const scrollCenter = e.contentSize.height - windowHeight;

      if (
        e.contentOffset.y >= scrollCenter &&
        prevMaxHeight.value !== e.contentSize.height
      ) {
        prevMaxHeight.value = e.contentSize.height;
        if (!isFocused) {
          runOnJS(updateCafeByCategory)();
        }
      }
    },
  });

  useEffect(() => {
    getCafeByCategory();
  }, [categoryTitle]);

  async function getCafeByCategory() {
    setCafeItems([]);
    cafeCount.value = 0;
    setLoading({show: true, success: true});
    try {
      const response = await axios.get(
        api.restaurants.get_list_of_restaurants_by_categories,
        {
          params: {
            title: categoryTitle,
            itemCount: 0,
          },
        },
      );

      if (response.data.length > 0) {
        setCafeItems(response.data);
        cafeCount.value = 5;
        setLoading({show: false, success: true});
      } else {
        setLoading({show: true, success: false});
      }
    } catch (error) {
      console.log('Could not get Restaurants', error);
    }
  }

  async function updateCafeByCategory() {
    try {
      const response = await axios.get(
        api.restaurants.get_list_of_restaurants_by_categories,
        {
          params: {
            title: categoryTitle,
            itemCount: cafeCount.value,
          },
        },
      );

      setCafeItems(_.concat(cafeItems, response.data));
      cafeCount.value = cafeCount.value + 5;
    } catch (error) {
      console.log('Could not get Restaurants', error);
    }
  }

  return (
    <Animated.ScrollView
      style={styles.home}
      onScroll={scrollHandler}
      scrollEnabled={cafeOpened || isFocused ? false : true}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="always"
      scrollEventThrottle={16}>
      <StatusBar animated={true} barStyle="dark-content" />
      <HeaderHome
        yAxis={yAxis}
        isTop_list={isTop_list}
        isFocused={isFocused}
        setIsFocused={setIsFocused}
        cafeOpened={cafeOpened}
        setCategoryTitle={setCategoryTitle}
      />

      <View style={styles.home__space} />

      {cafeItems.map((cafe, i) => (
        <Cafe yAxis={yAxis} cafe={cafe} key={i} />
      ))}

      <LoadingSearch loading={loading} />

      {cafeItems.length > 4 && (
        <View style={styles.home__progress}>
          <Progress.Circle
            size={50}
            indeterminate={true}
            color={colors.green}
            borderWidth={3}
          />
        </View>
      )}
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  home: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },

  home__progress: {
    width: '100%',
    height: 100,
    alignItems: 'center',
  },

  home__space: {
    width: '100%',
    height: 225,
  },
});

export default connect(mapStateToProps, null)(Home);
