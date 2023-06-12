import React, {useState, useLayoutEffect, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import colors from '../extensions/Colors';
import {ScrollView} from 'react-native-gesture-handler';
import CardItem from '../items/CardItem';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import NavigateButton from './NavigateButton';
import {connect} from 'react-redux';
import axios from 'axios';
import api from '../extensions/Api';
import {setUser, setLoading, setCurrentOrder} from '../../redux/Reducers';
import MainButton from '../extensions/MainButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

function mapStateToProps(state) {
  return {
    user: state.userReducer,
    currentOrder: state.currentOrderReducer,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setUser: user => dispatch(setUser(user)),
    setLoading: (opened, done) => dispatch(setLoading(opened, done)),
    setCurrentOrder: currentOrder => dispatch(setCurrentOrder(currentOrder)),
  };
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function Cards({user, setUser, setLoading, currentOrder, setCurrentOrder}) {
  const navigation = useNavigation();
  const [changeMode, setChangeMode] = useState(false);
  const [selectedIdCards, setSelectedIdCards] = useState([]);

  async function saveDefaultPayment(card) {
    try {
      await AsyncStorage.setItem('defaultPayment', JSON.stringify(card));
      setCurrentOrder({
        payment: card,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function unsaveDefaultPayment() {
    try {
      for (let i = 0; i < selectedIdCards.length; i++) {
        if (selectedIdCards[i] === currentOrder.payment?._id) {
          await AsyncStorage.removeItem('defaultPayment');
          setCurrentOrder({
            payment: null,
          });
          break;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleRemoveCards() {
    setLoading(true, false);
    try {
      await axios.patch(
        api.clients.remove_cards,
        {
          cards_id: selectedIdCards,
        },
        {
          headers: {'x-auth-token': user.authToken},
        },
      );
      unsaveDefaultPayment();

      setUser({
        ...user,
        cards: user.cards.filter(a => !selectedIdCards.includes(a._id)),
      });
      handleChangeMode();
    } catch (error) {
      console.log(error);
    }
    setLoading(true, true);
  }

  function handleNewCard() {
    setChangeMode(false);
    navigation.navigate('NewCard');
  }

  function handleChangeMode() {
    setSelectedIdCards([]);
    setChangeMode(changeMode ? false : true);
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          disabled={user.cards?.length > 0 ? false : true}
          onPress={handleChangeMode}
          title={changeMode ? 'Отмена' : 'Изменить'}
        />
      ),
    });
  }, [navigation, changeMode, user]);

  const checkmarkStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {scale: currentOrder.payment === 'Наличными' ? withTiming(1) : 0},
      ],
    };
  }, [currentOrder.payment]);

  const config = {duration: 300};

  const deleteButtonStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(changeMode ? 1 : 0, config),
      transform: [
        {
          scale: changeMode
            ? 1
            : withDelay(config.duration, withTiming(0, {duration: 0})),
        },
      ],
    };
  }, [changeMode]);

  return (
    <ScrollView style={styles.cards} scrollEventThrottle={16}>
      {user.cards && user.cards.length > 0 && (
        <>
          <View style={styles.cards__space} />
          <View style={styles.cards__container}>
            <View style={styles.cards__subContainer}>
              {user.cards.map((card, i) => (
                <CardItem
                  card={card}
                  changeMode={changeMode}
                  currentOrder={currentOrder}
                  selectedIdCards={selectedIdCards}
                  setSelectedIdCards={setSelectedIdCards}
                  saveDefaultPayment={saveDefaultPayment}
                  key={i}
                />
              ))}
            </View>
          </View>
        </>
      )}

      <View style={styles.cards__space} />

      <View style={styles.cards__container}>
        <View style={styles.cards__subContainer}>
          <TouchableWithoutFeedback
            onPress={() => saveDefaultPayment('Наличными')}>
            <View style={styles.cards__cash}>
              <MaterialCommunityIcons
                style={styles.cards__icon}
                name="cash"
                size={30}
                color="black"
              />
              <View
                style={[styles.cards__titleBox, styles.cards__bottomBorder]}>
                <Text style={styles.cards__iconTitle}>Оплата наличными</Text>
                <Animated.View
                  style={[styles.cards__checkmarkIcon, checkmarkStyle]}>
                  <Entypo name="check" size={20} color={colors.green} />
                </Animated.View>
              </View>
            </View>
          </TouchableWithoutFeedback>

          <NavigateButton
            title="Добавить карту"
            handleClick={handleNewCard}
            icon={
              <MaterialCommunityIcons
                name="credit-card-plus-outline"
                size={30}
                color="black"
              />
            }
          />
        </View>
      </View>

      <Animated.View style={deleteButtonStyle}>
        <MainButton
          title="Удалить"
          handlePress={handleRemoveCards}
          color={colors.red}
          disabled={selectedIdCards.length > 0 ? false : true}
          marginTop={30}
        />
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  cards: {
    width: '100%',
    height: '100%',
  },

  cards__space: {
    width: '100%',
    height: 60,
  },

  cards__container: {
    backgroundColor: 'white',
    borderWidth: 0.2,
    borderColor: 'grey',
    overflow: 'hidden',
    alignItems: 'center',
  },

  cards__subContainer: {
    width: windowWidth - 30,
  },

  cards__addCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  cards__icon: {
    marginRight: 15,
  },

  cards__iconTitle: {
    fontSize: 16,
  },

  cards__cash: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },

  cards__titleBox: {
    flexDirection: 'row',
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 15,
    paddingBottom: 15,
  },

  cards__bottomBorder: {
    borderBottomWidth: 0.2,
    borderBottomColor: 'grey',
  },

  cards__checkmarkIcon: {
    backgroundColor: colors.lightGreen,
    width: 25,
    height: 25,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Cards);
