import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Dimensions, Text} from 'react-native';
import Animated, {
  useSharedValue,
  runOnJS,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import * as Progress from 'react-native-progress';
import Cafe from '../home/cafe/Cafe';
import Api from '../../extensions/Api';
import axios from 'axios';
import {connect} from 'react-redux';
import Header from './Header';
import colors from '../../extensions/Colors';
import _ from 'lodash';
import {useNavigation} from '@react-navigation/native';

function mapStateToProps(state) {
  return {
    cafeOpened: state.cafeOpenedReducer,
    favourites: state.favouritesReducer,
  };
}

const windowHeight = Dimensions.get('window').height;

function Favorites({favourites, cafeOpened}) {
  const [cafeItems, setCafeItems] = useState([]);
  const cafeCount = useSharedValue(0);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  const yAxis = useSharedValue(0);
  const prevMaxHeight = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: e => {
      yAxis.value = e.contentOffset.y;
      const scrollCenter = e.contentSize.height - windowHeight;

      if (
        e.contentOffset.y >= scrollCenter &&
        prevMaxHeight.value !== e.contentSize.height
      ) {
        prevMaxHeight.value = e.contentSize.height;
        runOnJS(updateCafeByCategory)();
      }
    },
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getCafeById();
    });

    return unsubscribe;
  }, [navigation, favourites]);

  async function getCafeById() {
    setLoading(true);
    setCafeItems([]);
    cafeCount.value = 0;
    try {
      const response = await axios.get(
        Api.restaurants.get_list_of_restaurants_by_id,
        {
          params: {
            favourites: favourites,
            itemCount: 0,
          },
        },
      );
      setCafeItems(response.data);
      cafeCount.value = 5;
    } catch (error) {
      console.log('Could not get Restaurants', error);
    }
    setLoading(false);
  }

  async function updateCafeByCategory() {
    try {
      const response = await axios.get(
        Api.restaurants.get_list_of_restaurants_by_id,
        {
          params: {
            favourites: favourites,
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
      scrollEnabled={cafeOpened ? false : true}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="always"
      scrollEventThrottle={16}>
      <Header yAxis={yAxis} />
      <View style={styles.home__space} />
      {cafeItems.map((cafe, i) => (
        <Cafe yAxis={yAxis} cafe={cafe} key={i} />
      ))}

      {cafeItems.length === 0 && (
        <View style={styles.home__textBox}>
          <Text style={styles.home__emptyText}>Пусто</Text>
        </View>
      )}

      {loading && (
        <View style={styles.home__textBox}>
          <Progress.Circle
            size={70}
            indeterminate={true}
            color={colors.green}
            borderWidth={3}
          />
        </View>
      )}

      <View style={styles.home__progress}>
        {cafeItems.length > 4 && favourites.length !== cafeItems.length && (
          <Progress.Circle
            size={50}
            indeterminate={true}
            color={colors.green}
            borderWidth={3}
          />
        )}
      </View>
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

  home__textBox: {
    position: 'absolute',
    backgroundColor: 'white',
    width: '100%',
    height: windowHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },

  home__emptyText: {
    fontSize: 25,
    color: 'grey',
  },

  home__space: {
    width: '100%',
    height: 150,
  },
});

export default connect(mapStateToProps, null)(Favorites);
