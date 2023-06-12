import React, {useEffect} from 'react';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Api from '../extensions/Api';
import {createDrawerNavigator} from '@react-navigation/drawer';
import LeftSide from '../leftSide/LeftSide';
import Home from '../rightSide/home/Home';
import OrderHistory from '../rightSide/orderHistory/OrderHistory';
import Help from '../rightSide/help/Help';
import {connect} from 'react-redux';
import Favorites from '../rightSide/favorites/Favorites';
import Settings from '../settings/Settings';
import {setUser} from '../../redux/Reducers';

function mapStateToProps(state) {
  return {
    cafeOpened: state.cafeOpenedReducer,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setUser: user => dispatch(setUser(user)),
  };
}

function SubRoot({user, cafeOpened, setUser}) {
  const Drawer = createDrawerNavigator();

  async function updateDeviceToken(token) {
    const deviceToken = await AsyncStorage.getItem('deviceToken');

    if (!deviceToken || deviceToken !== token) {
      try {
        await axios.patch(
          Api.clients.save_device_token,
          {
            platform: Platform.OS === 'ios' ? 'ios' : 'android',
            deviceToken: token,
          },
          {
            headers: {'x-auth-token': user.authToken},
          },
        );
        await AsyncStorage.setItem('deviceToken', token);
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function updateUser() {
    try {
      const response = await axios.get(Api.clients.me, {
        headers: {'x-auth-token': user.authToken},
      });

      setUser({...response.data.client, authToken: user.authToken});
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    PushNotification.configure({
      onRegister: function (tokenData) {
        const {token} = tokenData;
        updateDeviceToken(token);
      },

      onNotification: function (notification) {
        updateUser();
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  }, []);

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        gestureEnabled: false,
        swipeEnabled: cafeOpened ? false : true,
      }}
      drawerContent={props => <LeftSide {...props} />}>
      <Drawer.Screen
        name="Главная"
        component={Home}
        options={{headerShown: false}}
      />

      <Drawer.Screen
        name="Избранные"
        component={Favorites}
        options={{headerShown: false}}
      />

      <Drawer.Screen
        name="История Заказов"
        component={OrderHistory}
        options={{headerShown: false}}
      />

      <Drawer.Screen
        name="Служба поддержки"
        component={Help}
        options={{headerShown: false}}
      />

      <Drawer.Screen
        name="Настройки"
        component={Settings}
        options={{headerShown: false}}
      />
    </Drawer.Navigator>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(SubRoot);
