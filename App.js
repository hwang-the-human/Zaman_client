import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Root from './screens/root/Root';
import Payment from './screens/payment/Payment';
import Comment from './screens/payment/Comment';
import Addresses from './screens/payment/Addresses';
import Cards from './screens/payment/Cards';
import NewCard from './screens/payment/NewCard';
import NewAddress from './screens/payment/NewAddress';
import TrackOrder from './screens/track/TrackOrder';
import LoadingPayment from './screens/payment/LoadingPayment';
import {connect} from 'react-redux';
import SignIn from './screens/authorization/SignIn';
import SendSms from './screens/authorization/SendSms';
import SignUp from './screens/authorization/SignUp';
import Loading from './screens/extensions/Loading';
import RecoveryPassword from './screens/authorization/RecoveryPassword';
import VerifySms from './screens/authorization/VerifySms';

function mapStateToProps(state) {
  return {
    loading: state.loadingReducer,
  };
}

const Stack = createStackNavigator();

function App({loading}) {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="Root"
          component={Root}
        />
        <Stack.Screen
          options={{title: 'Оплата заказа', headerBackTitle: 'Назад'}}
          name="Payment"
          component={Payment}
        />
        <Stack.Screen
          options={{title: 'Адрес доставки', headerBackTitle: 'Назад'}}
          name="Address"
          component={Addresses}
        />

        <Stack.Screen
          options={{title: 'Добавить адрес', headerBackTitle: 'Назад'}}
          name="NewAddress"
          component={NewAddress}
        />

        <Stack.Screen
          options={{
            title: 'Способ оплаты',
            headerBackTitle: 'Назад',
          }}
          name="Cards"
          component={Cards}
        />

        <Stack.Screen
          options={{title: 'Добавить карту', headerBackTitle: 'Назад'}}
          name="NewCard"
          component={NewCard}
        />

        <Stack.Screen
          options={{title: 'Комментарий', headerBackTitle: 'Назад'}}
          name="Comment"
          component={Comment}
        />

        <Stack.Screen
          options={{title: 'Заказ', headerBackTitle: 'Назад'}}
          name="TrackOrder"
          component={TrackOrder}
        />

        <Stack.Screen
          options={{title: 'Вход', headerBackTitle: 'Назад'}}
          name="SignIn"
          component={SignIn}
        />

        <Stack.Screen
          options={{title: 'Отправка смс', headerBackTitle: 'Назад'}}
          name="SendSms"
          component={SendSms}
        />

        <Stack.Screen
          options={{title: 'Подтверждение смс', headerBackTitle: 'Назад'}}
          name="VerifySms"
          component={VerifySms}
        />

        <Stack.Screen
          options={{title: 'Регистрация', headerBackTitle: 'Назад'}}
          name="SignUp"
          component={SignUp}
        />

        <Stack.Screen
          options={{title: 'Восстановление пароля', headerBackTitle: 'Назад'}}
          name="RecoveryPassword"
          component={RecoveryPassword}
        />
      </Stack.Navigator>
      <LoadingPayment />
      {loading.opened && <Loading />}
    </NavigationContainer>
  );
}

export default connect(mapStateToProps, null)(App);
