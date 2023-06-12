import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Dimensions, Text} from 'react-native';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  runOnJS,
  withTiming,
  useAnimatedRef,
} from 'react-native-reanimated';
import {connect} from 'react-redux';
import List from './List';
import Header from './Header';
import {
  PanGestureHandler,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import {setCafeOpened} from '../../../../redux/Reducers';
import ImageBar from './ImageBar';
import _ from 'lodash';
import {useNavigation} from '@react-navigation/native';
import SearchedList from './SearchedList';
import CheckOutButton from './CheckOutButton';
import Api from '../../../extensions/Api';
import axios from 'axios';

function mapStateToProps(state) {
  return {
    orders: state.ordersReducer,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setCafeOpened: opened => dispatch(setCafeOpened(opened)),
  };
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function Cafe({cafe, orders, setCafeOpened, yAxis}) {
  // Cafe
  const [opened, setOpened] = useState(false);
  const [positionY, setPositionY] = useState(0);
  const cafeZIndex = useSharedValue(0);
  const cafeRef = useAnimatedRef();
  const cafeScale = useSharedValue(1);
  const width = useSharedValue(windowWidth - 30);
  const height = useSharedValue(200);
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const [totalPrice, setTotalPrice] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  // ImageBar
  const imageScale = useSharedValue(1);
  const imageOpacity = useSharedValue(0);

  // Header
  const [categoryBarList, setCategoryBarList] = useState([]);
  const [listCategoryLayout, setListCategoryLayout] = useState([]);
  const titleY = useSharedValue(230);
  const showCategoryBar = useSharedValue(false);
  const showHeader = useSharedValue(false);

  // List
  const listRef = useRef();
  const [dishes, setDishes] = useState([]);
  const [showDishes, setShowDishes] = useState(false);
  const showDishesRef = useRef();
  const cancelToken = axios.CancelToken.source();
  const [searchedListOpened, setSearchedListOpened] = useState(false);
  const showCheckOut = useSharedValue(false);

  // Others
  const navigation = useNavigation();

  function handleCheckOut() {
    navigation.navigate('Payment', {
      cafe: cafe,
    });
  }

  function handleOpenCafe() {
    cafeZIndex.value = 2;
    setOpened(true);
    setCafeOpened(true);
  }

  function handleCloseCafe() {
    listRef.current.scrollTo({x: 0, y: 0, animated: true});
    setOpened(false);
  }

  function handleAfterCloseCafe() {
    cafeZIndex.value = 0;
    setCafeOpened(false);
  }

  const tapGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      cafeScale.value = withSpring(0.9);
    },
    onFail: (e, ctx) => {
      cafeScale.value = withSpring(1);
    },
    onEnd: _ => {
      cafeScale.value = withSpring(1);
      runOnJS(handleOpenCafe)();
    },
  });

  function cancelLoadDishes() {
    if (!showDishes) {
      cancelToken.cancel('Operation canceled by the user.');
      clearTimeout(showDishesRef.current);
    }
  }

  const panGestureHandler = useAnimatedGestureHandler({
    onStart: (e, ctx) => {
      runOnJS(cancelLoadDishes)();
    },
    onActive: (e, ctx) => {
      y.value = e.translationY + yAxis.value + positionY;
      x.value = e.translationX;
    },
    onEnd: (e, ctx) => {
      if (e.velocityX < 600) {
        if (x.value > windowWidth / 4) {
          runOnJS(handleCloseCafe)();
        } else {
          runOnJS(loadDishes)();
          x.value = withTiming(0, config);
          y.value = withTiming(positionY + yAxis.value, config);
        }
      } else {
        runOnJS(handleCloseCafe)();
      }
    },
  });

  useEffect(() => {
    var price = 0;
    var count = 0;

    for (let i = 0; i < orders.length; i++) {
      if (orders[i].cafe_id === cafe._id) {
        price += orders[i].price * orders[i].quantity;
        count += orders[i].quantity;
      }
    }

    if (price === 0) {
      showCheckOut.value = false;
    } else {
      showCheckOut.value = true;
    }

    setTotalCount(count);
    setTotalPrice(price);
  }, [orders]);

  const config = {
    duration: 300,
    // easing: Easing.bezier(0.5, 0.01, 0, 1),
  };

  async function loadDishes() {
    let error;

    if (dishes.length < 1) {
      try {
        var response = await axios.get(
          Api.restaurants.get_dishes_of_selected_restaurant,
          {
            cancelToken: cancelToken.token,
            params: {
              _id: cafe._id,
            },
          },
        );

        setDishes(response.data);
      } catch (err) {
        error = err;
      }
    }

    if (!error && !showDishes) {
      showDishesRef.current = setTimeout(() => {
        setShowDishes(true);
      }, config.duration);
    }
  }

  useEffect(() => {
    if (opened) {
      loadDishes();

      width.value = withTiming(windowWidth, config);
      height.value = withTiming(windowHeight, config);

      x.value = withTiming(0, config);
      y.value = withTiming(positionY + yAxis.value, config);
    } else {
      width.value = withTiming(windowWidth - 30, config);
      height.value = withTiming(200, config);

      x.value = withTiming(0, config);
      y.value = withTiming(0, config, () => {
        runOnJS(handleAfterCloseCafe)();
      });
    }
  }, [opened]);

  const cafeStyle = useAnimatedStyle(() => {
    return {
      width: width.value,
      height: height.value,

      transform: [
        {
          translateX: x.value,
        },
        {
          translateY: y.value,
        },
        {scale: cafeScale.value},
      ],
    };
  }, []);

  const mainContainer = useAnimatedStyle(() => {
    return {
      maxHeight: 200,
      marginBottom: 30,
      zIndex: cafeZIndex.value,
    };
  }, [cafeZIndex.value]);

  const discountTextStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opened ? 0 : 1, config),
      transform: [{scale: withTiming(opened ? 0 : 1, config)}],
    };
  }, [opened]);

  return (
    <TapGestureHandler
      onGestureEvent={tapGestureHandler}
      shouldCancelWhenOutside={true}
      enabled={opened || !cafe.status.opened ? false : true}>
      <Animated.View
        style={mainContainer}
        onLayout={e => {
          if (positionY === 0) {
            setPositionY(-e.nativeEvent.layout.y);
          }
        }}>
        <PanGestureHandler
          onGestureEvent={panGestureHandler}
          enabled={opened ? true : false}
          failOffsetX={-1}
          failOffsetY={[-1, 1]}>
          <Animated.View style={[styles.cafe, cafeStyle]} ref={cafeRef}>
            <View style={styles.cafe_container}>
              <View style={styles.cafe__subContainer}>
                <Header
                  cafe={cafe}
                  opened={opened}
                  imageOpacity={imageOpacity}
                  titleY={titleY}
                  config={config}
                  handleCloseCafe={handleCloseCafe}
                  setSearchedListOpened={setSearchedListOpened}
                  showCategoryBar={showCategoryBar}
                  showHeader={showHeader}
                  categoryBarList={categoryBarList}
                  listRef={listRef}
                  listCategoryLayout={listCategoryLayout}
                />

                <ImageBar
                  image={cafe.image}
                  imageScale={imageScale}
                  opened={opened}
                  imageOpacity={imageOpacity}
                  config={config}
                />

                <List
                  dishes={dishes}
                  opened={opened}
                  showDishes={showDishes}
                  imageScale={imageScale}
                  titleY={titleY}
                  cafe={cafe}
                  imageOpacity={imageOpacity}
                  config={config}
                  listRef={listRef}
                  showCategoryBar={showCategoryBar}
                  showHeader={showHeader}
                  categoryBarList={categoryBarList}
                  listCategoryLayout={listCategoryLayout}
                  setListCategoryLayout={setListCategoryLayout}
                />

                {searchedListOpened && (
                  <SearchedList
                    cafe={cafe}
                    dishes={dishes}
                    searchedListOpened={searchedListOpened}
                    setSearchedListOpened={setSearchedListOpened}
                    config={config}
                  />
                )}

                {cafe.discount > 0 && (
                  <Animated.Text
                    style={[styles.cafe_discountText, discountTextStyle]}>
                    -{cafe.discount}%
                  </Animated.Text>
                )}

                {!cafe.status.opened && (
                  <View style={styles.cafe__closed}>
                    <Text style={styles.cafe__closedTitle}>Время работы:</Text>
                    <View>
                      {cafe.status.time.map((time, i) => (
                        <Text style={styles.cafe__closedSubTitle} key={i}>
                          {time}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}
              </View>

              <CheckOutButton
                opened={opened}
                totalCount={totalCount}
                totalPrice={totalPrice}
                showCheckOut={showCheckOut}
                handleCheckOut={handleCheckOut}
                config={config}
              />
            </View>
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </TapGestureHandler>
  );
}

const styles = StyleSheet.create({
  cafe: {
    backgroundColor: 'white',
    borderRadius: 15,
    alignSelf: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },

  cafe_container: {
    overflow: 'hidden',
  },

  cafe__subContainer: {
    borderRadius: 15,
    overflow: 'hidden',
  },

  cafe_discountText: {
    zIndex: 1,
    position: 'absolute',
    backgroundColor: 'orange',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    right: -3,
    top: 30,
    padding: 5,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },

  cafe__closed: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cafe__closedTitle: {
    fontSize: 30,
    fontWeight: '500',
    color: 'white',
    marginBottom: 15,
  },

  cafe__closedSubTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: 'white',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Cafe);
