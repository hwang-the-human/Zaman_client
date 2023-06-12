import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import Entypo from 'react-native-vector-icons/Entypo';
import CustomButton from '../extensions/CustomButton';
import colors from '../extensions/Colors';
import axios from 'axios';
import {connect} from 'react-redux';
import Api from '../extensions/Api';
import {setUser} from '../../redux/Reducers';
import _ from 'lodash';

function mapStateToProps(state) {
  return {
    user: state.userReducer,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setUser: user => dispatch(setUser(user)),
  };
}

function MessageItem({message, user, opened, setSelected, setUser, index}) {
  const messageOpened = useSharedValue(true);

  function handleNextMessage() {
    messageOpened.value = false;

    if (user.notification.messages.length <= index + 1) {
      opened.value = false;
    }
  }

  async function removeMessages() {
    try {
      await axios.patch(
        Api.clients.remove_messages,
        {},
        {
          headers: {'x-auth-token': user.authToken},
        },
      );
    } catch (error) {
      console.log(error);
    }
    setUser(_.omit(user, 'notification.messages'));
  }

  function updateState() {
    if (user.notification.messages.length > index + 1) {
      setSelected(index + 1);
    } else {
      removeMessages();
    }
  }

  const config = {
    duration: 300,
  };

  const messageStyle = useAnimatedStyle(() => {
    return {
      opacity: messageOpened.value
        ? withSequence(withTiming(0, config), withTiming(1, config))
        : withTiming(0, config),
      transform: [
        {
          translateX: messageOpened.value
            ? withSequence(withTiming(100, config), withTiming(0, config))
            : withTiming(-100, config, () => {
                runOnJS(updateState)();
              }),
        },
      ],
    };
  }, [messageOpened.value, user.notification.messages.length]);

  return (
    <Animated.View style={[styles.message, messageStyle]}>
      <View style={styles.message__scrollBox}>
        <View style={styles.message__titleBox}>
          <Entypo name="emoji-sad" size={100} color="white" />

          <Text style={styles.message__title}>Мы сожалеем</Text>
          <Text style={styles.message__subTitle}>
            Заказ #{message.order_number} был отменен
          </Text>
        </View>

        <Text style={styles.message__text}>
          Сообщение от {message.restaurant}:
        </Text>
        <Text style={styles.message__subText} numberOfLines={15}>
          {message.text}
        </Text>
        <CustomButton
          style={styles.message__button}
          handleButton={handleNextMessage}>
          <Text style={styles.message__buttonText}>Продолжить</Text>
        </CustomButton>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  message: {
    position: 'absolute',
    width: '80%',
    backgroundColor: colors.blue,
    borderRadius: 30,
    alignItems: 'center',

    shadowColor: 'white',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },

  message__scrollBox: {
    margin: 15,
  },

  message__titleBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  message__title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },

  message__subTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginBottom: 30,
  },

  message__text: {
    fontWeight: '600',
    fontSize: 20,
    color: 'white',
  },

  message__subText: {
    fontSize: 16,
    color: 'white',
  },

  message__space: {
    height: 100,
    width: '100%',
  },

  message__button: {
    marginTop: 15,
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },

  message__buttonText: {
    fontWeight: '500',
    fontSize: 18,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(MessageItem);
