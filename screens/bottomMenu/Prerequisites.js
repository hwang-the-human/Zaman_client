import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
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
import colors from '../extensions/Colors';
import {ScrollView} from 'react-native-gesture-handler';
import PreOption from '../items/PreOption';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import {TapGestureHandler} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import _ from 'lodash';
import uuid from 'react-native-uuid';
import {pushOrder} from '../../redux/Reducers';

function mapDispatchToProps(dispatch) {
  return {
    pushOrder: order => dispatch(pushOrder(order)),
  };
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function Prerequisites({dish, pushOrder, setOpened}) {
  const buttonValue = useSharedValue(1);
  const [prerequisites, setPrerequisites] = useState([]);
  const buttonOff = useSharedValue(false);

  useEffect(() => {
    const result = _.filter(dish.prerequisites, e => {
      return e.required === true;
    });

    if (result.length > 0) {
      let disable;
      loop1: for (let a = 0; a < result.length; a++) {
        for (let b = 0; b < result[a].options.length; b++) {
          const final = _.some(prerequisites, result[a].options[b]);

          if (final) {
            disable = false;
            break;
          }

          if (!final && b + 1 >= result[a].options.length) {
            disable = true;
            break loop1;
          }
        }
      }
      buttonOff.value = disable;
    }
  }, [prerequisites]);

  function handleAddOrder() {
    const newPrice =
      dish.price +
      _.sumBy(prerequisites, item => {
        return item.price;
      });

    const newOrder = {
      cafe_id: dish.cafe_id,
      dish_id: dish._id,
      footer_id: uuid.v4(),
      title: dish.title,
      price: newPrice,
      quantity: 1,
      prerequisites: prerequisites,
    };

    pushOrder(newOrder);

    setOpened(false);
  }

  const panGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      if (!buttonOff.value) {
        buttonValue.value = withSpring(0.9);
      }
    },
    onFail: (e, ctx) => {
      if (!buttonOff.value) {
        buttonValue.value = withSpring(1);
      }
    },
    onEnd: _ => {
      if (!buttonOff.value) {
        buttonValue.value = withSpring(1);
        runOnJS(handleAddOrder)();
      }
    },
  });

  const config = {
    duration: 300,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };

  const buttonStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(buttonOff.value ? 0.5 : 1, config),
      transform: [
        {
          scale: buttonValue.value,
        },
      ],
    };
  });

  function checkNumberText(number) {
    switch (true) {
      case number <= 1:
        return number + ' предмет';
      case number <= 4:
        return number + ' предмета';
      case number <= 20:
        return number + ' предметов';
      default:
        return number;
    }
  }

  return (
    <View style={styles.prerequisites}>
      <ScrollView scrollEventThrottle={16}>
        {dish.prerequisites.map((item, index) => {
          const isDisabled = useSharedValue(false);
          const [count, setCount] = useState(0);

          return (
            <View style={styles.prerequisites__category} key={index}>
              <Text style={styles.prerequisites__title}>{item.title}</Text>
              <View style={styles.prerequisites__subTitleBox}>
                <Text style={styles.prerequisites__subTitle}>
                  Выберите максимум {checkNumberText(item.max)}
                </Text>
                {item.required && (
                  <View style={{flexDirection: 'row'}}>
                    <Entypo name="dot-single" size={20} color={'grey'} />
                    <View style={styles.prerequisites__textBox}>
                      <Text style={styles.prerequisites__text}>
                        Обязательно
                      </Text>
                    </View>
                  </View>
                )}
              </View>
              {item.options.map((subItem, index) => {
                const isAdded = useSharedValue(false);

                return (
                  <PreOption
                    isAdded={isAdded}
                    count={count}
                    setCount={setCount}
                    data={subItem}
                    prerequisites={prerequisites}
                    setPrerequisites={setPrerequisites}
                    max={item.max}
                    buttonValue={buttonValue}
                    isDisabled={isDisabled}
                    key={index}
                  />
                );
              })}
            </View>
          );
        })}
        <View style={styles.prerequisites__spacing} />
      </ScrollView>
      <TapGestureHandler
        onGestureEvent={panGestureHandler}
        shouldCancelWhenOutside={true}>
        <Animated.View style={[styles.prerequisites__button, buttonStyle]}>
          <Text style={styles.prerequisites__buttonText}>
            Добавить{' '}
            {dish.price +
              _.sumBy(prerequisites, item => {
                return item.price;
              })}{' '}
            тг.
          </Text>
        </Animated.View>
      </TapGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  prerequisites: {
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
    alignSelf: 'center',
  },

  prerequisites__category: {
    width: windowWidth - 30,
    paddingTop: 30,
    paddingBottom: 30,
    borderBottomColor: colors.grey,
    borderBottomWidth: 0.2,
    alignSelf: 'center',
  },

  prerequisites__title: {
    fontWeight: 'bold',
    fontSize: 20,
  },

  prerequisites__subTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: 5,
    marginBottom: 15,
  },

  prerequisites__subTitle: {
    color: 'grey',
    fontWeight: '500',
  },

  prerequisites__textBox: {
    backgroundColor: colors.red,
    borderRadius: 30,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 5,
    paddingRight: 5,
  },

  prerequisites__text: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },

  prerequisites__button: {
    position: 'absolute',
    backgroundColor: colors.green,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 100,
    width: windowWidth - 30,
    height: 40,
    borderRadius: 100,
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

  prerequisites__buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },

  prerequisites__spacing: {
    width: '100%',
    height: 150,
  },
});

export default connect(null, mapDispatchToProps)(Prerequisites);
