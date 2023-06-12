import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Dimensions,
  Keyboard,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import Api from '../extensions/Api';
import {connect} from 'react-redux';
import {setLoading, setUser} from '../../redux/Reducers';
import MainButton from '../extensions/MainButton';
import KeyboardView from '../extensions/KeyboardView';

function mapStateToProps(state) {
  return {
    user: state.userReducer,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setUser: user => dispatch(setUser(user)),
    setLoading: (opened, done) => dispatch(setLoading(opened, done)),
  };
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function NewCard({user, setUser, setLoading}) {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [date, setDate] = useState('');
  const [cvv, setCvv] = useState('');
  const cardRef = useRef();
  const dateRef = useRef();
  const CVVRef = useRef();

  async function handleAddNewCard() {
    Keyboard.dismiss();
    setLoading(true, false);
    try {
      const response = await axios.patch(
        Api.clients.add_card,
        {
          type: getCardType(number) ?? 'Card',
          name: name,
          number: number.replace(/ /g, ''),
          date: date,
          cvv: cvv,
        },
        {
          headers: {'x-auth-token': user.authToken},
        },
      );
      setUser({...user, cards: [...(user.cards ?? []), response.data]});
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
    setLoading(true, true);
  }

  function getCardType(number) {
    var cards = {
      Electron: /^(4026|417500|4405|4508|4844|4913|4917)\d+$/,
      Maestro:
        /^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)\d+$/,
      DK: /^(5019)\d+$/,
      InterPayment: /^(636)\d+$/,
      UnionPay: /^(62|88)\d+$/,
      Visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
      Mastercard: /^5[1-5][0-9]{14}$/,
      Amex: /^3[47][0-9]{13}$/,
      Discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
      Diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
      JCB: /^(?:2131|1800|35\d{3})\d{11}$/,
    };

    for (var key in cards) {
      if (cards[key].test(number.replace(/ /g, ''))) {
        return key;
      }
    }
  }

  return (
    <KeyboardView>
      <View style={styles.newCard}>
        <View style={styles.newCard__space} />
        <View style={styles.newCard__container}>
          <View style={styles.newCard__option}>
            <Ionicons
              style={styles.newCard__icon}
              name="person-outline"
              size={30}
              color="black"
            />
            <View style={styles.newCard__textInputBox}>
              <TextInput
                style={styles.newCard__textInput}
                onChangeText={text => {
                  setName(text.toUpperCase());
                }}
                value={name}
                autoFocus={true}
                maxLength={100}
                placeholder="Имя на карте"
                returnKeyType="next"
                onSubmitEditing={() => cardRef.current.focus()}
                placeholderTextColor="grey"
              />
            </View>
          </View>

          <View style={styles.newCard__option}>
            <Ionicons
              style={styles.newCard__icon}
              name="card-outline"
              size={30}
              color="black"
            />
            <View style={styles.newCard__textInputBox}>
              <TextInput
                style={styles.newCard__textInput}
                ref={cardRef}
                onChangeText={text => {
                  setNumber(
                    text
                      .replace(/[^\dA-Z]/g, '')
                      .replace(/(.{4})/g, '$1 ')
                      .trim(),
                  );

                  if (text.length === 19) {
                    dateRef.current.focus();
                  }
                }}
                keyboardType="numeric"
                value={number}
                maxLength={19}
                placeholder="4242 4242 4242 4242"
                placeholderTextColor="grey"
              />
            </View>
          </View>

          <View style={styles.newCard__subInfoBox}>
            <View style={[styles.newCard__option, {flex: 1}]}>
              <Ionicons
                style={styles.newCard__icon}
                name="calendar-outline"
                size={30}
                color="black"
              />
              <TextInput
                style={styles.newCard__textInput}
                ref={dateRef}
                onChangeText={text => {
                  if (text.length === 3) {
                    if (!text.includes('/')) {
                      text =
                        text.substring(0, 2) +
                        '/' +
                        text.substring(2, text.length);
                    } else {
                      text = text.slice(0, -1);
                    }
                  }
                  setDate(text);

                  if (text.length === 5) {
                    CVVRef.current.focus();
                  }
                }}
                value={date}
                keyboardType="numeric"
                maxLength={5}
                placeholder="ММ/ГГ"
                placeholderTextColor="grey"
              />
            </View>

            <View style={[styles.newCard__option, {flex: 1}]}>
              <Ionicons
                style={styles.newCard__icon}
                name="lock-closed-outline"
                size={30}
                color="black"
              />
              <TextInput
                style={styles.newCard__textInput}
                ref={CVVRef}
                onChangeText={setCvv}
                value={cvv}
                keyboardType="numeric"
                maxLength={3}
                placeholder="CVV"
                placeholderTextColor="grey"
              />
            </View>
          </View>
        </View>
        <MainButton
          title="Добавить карту"
          handlePress={handleAddNewCard}
          disabled={
            name.length > 1 &&
            number.length === 19 &&
            date.length === 5 &&
            cvv.length === 3
              ? false
              : true
          }
        />
      </View>
    </KeyboardView>
  );
}

const styles = StyleSheet.create({
  newCard: {
    width: '100%',
    height: '100%',
  },

  newCard__container: {
    backgroundColor: 'white',
    borderWidth: 0.2,
    borderColor: 'grey',
    marginBottom: 30,
  },

  newCard__space: {
    width: '100%',
    height: 60,
  },

  newCard__option: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
  },

  newCard__icon: {
    marginLeft: 15,
    marginRight: 15,
  },

  newCard__textInputBox: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    borderBottomWidth: 0.2,
    borderBottomColor: 'grey',
  },

  newCard__textInput: {
    height: '100%',
    fontSize: 16,
  },

  newCard__subInfoBox: {
    flexDirection: 'row',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(NewCard);
