import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Keyboard,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {connect} from 'react-redux';
import axios from 'axios';
import api from '../extensions/Api';
import {setLoading, setUser} from '../../redux/Reducers';
import MainButton from '../extensions/MainButton';
import KeyboardView from '../extensions/KeyboardView';
import SearchedAddressItem from '../items/SearchedAddressItem';
import InputField from '../authorization/InputField';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Progress from 'react-native-progress';

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

function NewAddress({user, setUser, setLoading}) {
  const navigation = useNavigation();
  const [street, setStreet] = useState('');
  const [aptNumber, setAptNumber] = useState('');
  const inputTextRef = useRef();
  const [focus, setFocus] = useState(false);
  const [isEmpty, setIEmpty] = useState(true);
  const [addresses, setAdresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  async function handleAddNewAddress() {
    Keyboard.dismiss();
    setLoading(true, false);
    try {
      const response = await axios.patch(
        api.clients.add_address,
        {
          street: street,
          aptNumber: aptNumber,
        },
        {
          headers: {'x-auth-token': user.authToken},
        },
      );
      setUser({...user, addresses: [...(user.addresses ?? []), response.data]});
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
    setLoading(true, true);
  }

  useEffect(() => {
    if (street.length !== 0 && focus) {
      setLoadingAddresses(true);
    }

    const timeoutId = setTimeout(handleSearchAddress, 1000);
    return () => clearTimeout(timeoutId);
  }, [street]);

  async function handleSearchAddress() {
    if (street.length !== 0 && focus) {
      try {
        const response = await axios.get(
          'https://catalog.api.2gis.com/3.0/items',
          {
            params: {
              q: street,
              key: 'ruplsm1219',
              city_id: '70030076195164311', //Алматы - 9430034490064971
              // type: 'building',
            },
          },
        );
        setAdresses(response.data.result?.items ?? []);
        setLoadingAddresses(false);
      } catch (error) {
        console.log(error);
      }
    }
  }

  function handleSelectStreet(street) {
    setStreet(street);
    setFocus(false);
    setIEmpty(false);
    inputTextRef.current.blur();
  }

  function handleFocus() {
    setFocus(true);
  }

  function handleUnFocus() {
    setFocus(false);
    inputTextRef.current.blur();

    if (addresses[0]) {
      setIEmpty(false);
      setStreet(addresses[0].full_name);
    } else {
      setIEmpty(true);
      setStreet('');
    }
  }

  function handleClearInput() {
    setIEmpty(true);
    setStreet('');
  }

  function handleOnChange(text) {
    if (text.length > 0) {
      setIEmpty(false);
    } else {
      setIEmpty(true);
    }
    setStreet(text);
  }

  const config = {
    duration: 500,
  };

  const iconStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      opacity: withTiming(focus ? 1 : 0, config),
      transform: [
        {
          scale: focus
            ? 1
            : withDelay(config.duration, withTiming(0, {duration: 0})),
        },
      ],
      backgroundColor: 'white',
      borderRadius: 100,
    };
  }, [focus]);

  const shadowStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      width: windowWidth,
      height: windowHeight,
      backgroundColor: 'rgba(0,0,0,0.2)',
      opacity: withTiming(focus ? 1 : 0),
      transform: [
        {
          scale: focus
            ? 1
            : withDelay(config.duration, withTiming(0, {duration: 0})),
        },
      ],
    };
  }, [focus]);

  const searchStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(focus ? 1 : 0),
      transform: [
        {
          scale: focus
            ? 1
            : withDelay(config.duration, withTiming(0, {duration: 0})),
        },
      ],
    };
  }, [focus]);

  const clearIconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: isEmpty ? withSpring(0) : withSpring(1),
        },
      ],
    };
  }, [isEmpty]);

  return (
    <KeyboardView>
      <View style={styles.newAddress}>
        <View style={styles.newAddress__space} />

        <View style={styles.newAddress__container}>
          <View style={[styles.newAddress__option, {zIndex: 1}]}>
            <View style={styles.newAddress__icon}>
              <AntDesign name="home" size={30} color="black" />
              <TouchableWithoutFeedback onPress={handleUnFocus}>
                <Animated.View style={iconStyle}>
                  <Ionicons name="ios-chevron-back" size={30} color="black" />
                </Animated.View>
              </TouchableWithoutFeedback>
            </View>

            <View
              style={[
                styles.newAddress__textInputBox,
                {borderBottomWidth: 0.2, borderBottomColor: 'grey'},
              ]}>
              <TextInput
                style={styles.newAddress__textInput}
                ref={inputTextRef}
                onFocus={handleFocus}
                onChangeText={text => handleOnChange(text)}
                value={street}
                maxLength={100}
                placeholder="Адрес и номер дома"
                placeholderTextColor="grey"
                returnKeyType="search"
                onSubmitEditing={handleUnFocus}
              />

              <TouchableWithoutFeedback onPress={handleClearInput}>
                <Animated.View
                  style={[styles.inputField__clearIcon, clearIconStyle]}>
                  <FontAwesome name="close" size={14} color="black" />
                </Animated.View>
              </TouchableWithoutFeedback>
            </View>
            <Animated.View style={[styles.newAddress__searchBox, searchStyle]}>
              <Animated.ScrollView keyboardShouldPersistTaps="always">
                {street.length === 0 && (
                  <SearchedAddressItem
                    title={'Улица Радостовца 202'}
                    subTitle={'Мы думаем, что вы здесь'}
                    icon={<Ionicons name="location" size={30} color="black" />}
                    handleSelectStreet={handleSelectStreet}
                  />
                )}

                {!loadingAddresses ? (
                  addresses.length === 0 && street.length > 0 ? (
                    <Text style={styles.newAddress__notFound}>
                      Ничего не найдено
                    </Text>
                  ) : (
                    addresses.map((address, i) => (
                      <SearchedAddressItem
                        title={address.full_name.substr(
                          address.full_name.indexOf(',') + 1,
                        )}
                        subTitle={address.full_name.split(',')[0]}
                        handleSelectStreet={handleSelectStreet}
                        key={i}
                      />
                    ))
                  )
                ) : (
                  <Progress.Circle
                    style={styles.newAddress__loadingIcon}
                    size={30}
                    indeterminate={true}
                    color={'grey'}
                    borderWidth={3}
                  />
                )}
              </Animated.ScrollView>
              <View style={styles.newAddress__licenseBox}>
                <Text style={styles.newAddress__licenseText}>powered by</Text>
                <Image
                  style={styles.newAddress__logo}
                  source={require('../../images/2gis.png')}
                />
              </View>
            </Animated.View>
          </View>

          <InputField
            input={aptNumber}
            setInput={setAptNumber}
            placeholder={'Подъезд / квартира / этаж / другое'}
            returnKey={'done'}
            maxLength={100}
            icon={<Feather name="hash" size={30} color="black" />}
          />
        </View>

        <MainButton
          title="Добавить адрес"
          handlePress={handleAddNewAddress}
          disabled={street.length > 4 && aptNumber.length > 0 ? false : true}
        />

        <TouchableWithoutFeedback onPress={handleUnFocus}>
          <Animated.View style={shadowStyle} />
        </TouchableWithoutFeedback>
      </View>
    </KeyboardView>
  );
}

const styles = StyleSheet.create({
  newAddress: {
    width: '100%',
    height: '100%',
  },

  newAddress__container: {
    zIndex: 1,
    backgroundColor: 'white',
    borderWidth: 0.2,
    borderColor: 'grey',
    marginBottom: 30,
  },

  newAddress__space: {
    width: '100%',
    height: 60,
  },

  newAddress__option: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
  },

  newAddress__icon: {
    marginLeft: 15,
    marginRight: 15,
  },

  newAddress__textInputBox: {
    flexDirection: 'row',
    flex: 1,
    height: '100%',
    alignItems: 'center',
  },

  newAddress__textInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },

  newAddress__searchBox: {
    position: 'absolute',
    backgroundColor: 'white',
    width: '100%',
    left: 0,
    top: 60,
    maxHeight: 230,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
  },

  newAddress__licenseBox: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    right: 15,
    height: 50,
  },

  newAddress__licenseText: {
    color: 'grey',
  },

  newAddress__logo: {
    width: 60,
    height: 30,
  },

  inputField__clearIcon: {
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    marginLeft: 15,
    width: 24,
    height: 24,
    borderRadius: 24,
  },

  newAddress__notFound: {
    marginTop: 20,
    color: 'grey',
    fontSize: 18,
  },

  newAddress__loadingIcon: {
    marginTop: 20,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(NewAddress);
