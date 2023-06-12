import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Dimensions, Text} from 'react-native';
import Animated, {
  useSharedValue,
  runOnJS,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import * as Progress from 'react-native-progress';
import Api from '../../extensions/Api';
import axios from 'axios';
import {connect} from 'react-redux';
import _ from 'lodash';
import {useNavigation} from '@react-navigation/native';
import colors from '../../extensions/Colors';
import Header from '../../extensions/Header';
import TrackItem from '../../items/TrackItem';

function mapStateToProps(state) {
  return {
    user: state.userReducer,
  };
}

const windowHeight = Dimensions.get('window').height;

function OrderHistory({user}) {
  const [orders, setOrders] = useState([]);
  const historyCount = useSharedValue(0);
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
        runOnJS(updateOrderHistory)();
      }
    },
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getOrderHistory();
    });

    return unsubscribe;
  }, [navigation]);

  async function getOrderHistory() {
    setLoading(true);
    setOrders([]);
    historyCount.value = 0;
    try {
      const response = await axios.get(Api.orders.get_order_history, {
        params: {
          itemCount: 0,
          path: 'client',
        },
        headers: {'x-auth-token': user.authToken},
      });

      setOrders(response.data);
      historyCount.value = 8;
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  async function updateOrderHistory() {
    try {
      const response = await axios.get(Api.orders.get_order_history, {
        params: {
          itemCount: historyCount.value,
          path: 'client',
        },
        headers: {'x-auth-token': user.authToken},
      });

      setOrders(_.concat(orders, response.data));
      historyCount.value = historyCount.value + 8;
    } catch (error) {
      console.log('Could not get Restaurants', error);
    }
  }

  return (
    <Animated.ScrollView
      style={styles.home}
      onScroll={scrollHandler}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="always"
      scrollEventThrottle={16}>
      <Header title={'История заказов'} />

      {orders.map((track, i) => (
        <TrackItem track={track} history={true} key={i} />
      ))}

      {orders.length === 0 && (
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

      <View style={styles.home__space} />

      <View style={styles.home__progress}>
        {historyCount.value <= orders.length &&
          historyCount.value !== 0 && (
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
    height: 30,
  },
});

export default connect(mapStateToProps, null)(OrderHistory);
