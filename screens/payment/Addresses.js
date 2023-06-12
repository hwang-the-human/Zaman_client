import React, {useState, useLayoutEffect, useEffect} from 'react';
import {StyleSheet, View, Button, Dimensions} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import colors from '../extensions/Colors';
import {ScrollView} from 'react-native-gesture-handler';
import AddressItem from '../items/AddressItem';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import NavigateButton from './NavigateButton';
import MainButton from '../extensions/MainButton';
import {connect} from 'react-redux';
import {setUser, setLoading, setCurrentOrder} from '../../redux/Reducers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import api from '../extensions/Api';

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

function Address({user, setUser, setLoading, currentOrder, setCurrentOrder}) {
  const navigation = useNavigation();
  const [changeMode, setChangeMode] = useState(false);
  const [selectedIdAddresses, setSelectedIdAddresses] = useState([]);

  async function saveDefaultAddress(address) {
    try {
      await AsyncStorage.setItem('defaultAddress', JSON.stringify(address));
      setCurrentOrder({
        address: address,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function unsaveDefaultAddress() {
    try {
      for (let i = 0; i < selectedIdAddresses.length; i++) {
        if (selectedIdAddresses[i] === currentOrder.address?._id) {
          await AsyncStorage.removeItem('defaultAddress');
          setCurrentOrder({
            address: null,
          });
          break;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleRemoveAddress() {
    setLoading(true, false);
    try {
      await axios.patch(
        api.clients.remove_addresses,
        {
          addresses_id: selectedIdAddresses,
        },
        {
          headers: {'x-auth-token': user.authToken},
        },
      );
      unsaveDefaultAddress();

      setUser({
        ...user,
        addresses: user.addresses.filter(
          a => !selectedIdAddresses.includes(a._id),
        ),
      });
      handleChangeMode();
    } catch (error) {
      console.log(error);
    }
    setLoading(true, true);
  }

  function handleNewAddress() {
    setChangeMode(false);
    navigation.navigate('NewAddress');
  }

  function handleChangeMode() {
    setSelectedIdAddresses([]);
    setChangeMode(changeMode ? false : true);
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          disabled={user.addresses?.length > 0 ? false : true}
          onPress={handleChangeMode}
          title={changeMode ? 'Отмена' : 'Изменить'}
        />
      ),
    });
  }, [navigation, changeMode, user]);

  const config = {duration: 300};

  const deleteButtonStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(changeMode ? 1 : 0),
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
    <ScrollView style={styles.addresses} scrollEventThrottle={16}>
      {user.addresses && user.addresses.length > 0 && (
        <>
          <View style={styles.addresses__space} />
          <View style={styles.addresses__container}>
            <View style={styles.addresses__subContainer}>
              {user.addresses.map((address, i) => (
                <AddressItem
                  address={address}
                  changeMode={changeMode}
                  currentOrder={currentOrder}
                  selectedIdAddresses={selectedIdAddresses}
                  setSelectedIdAddresses={setSelectedIdAddresses}
                  saveDefaultAddress={saveDefaultAddress}
                  key={i}
                />
              ))}
            </View>
          </View>
        </>
      )}

      <View style={styles.addresses__space} />

      <View style={styles.addresses__container}>
        <View style={styles.addresses__subContainer}>
          <NavigateButton
            title="Добавить адрес"
            handleClick={handleNewAddress}
            icon={
              <MaterialCommunityIcons
                name="home-plus-outline"
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
          handlePress={handleRemoveAddress}
          color={colors.red}
          disabled={selectedIdAddresses.length > 0 ? false : true}
          marginTop={30}
        />
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  addresses: {
    width: '100%',
    height: '100%',
  },

  addresses__space: {
    width: '100%',
    height: 60,
  },

  addresses__container: {
    backgroundColor: 'white',
    borderWidth: 0.2,
    borderColor: 'grey',
    overflow: 'hidden',
    alignItems: 'center',
  },

  addresses__subContainer: {
    width: windowWidth - 30,
  },

  addresses__titleBox: {
    flexDirection: 'row',
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Address);
