import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import SubRoot from './SubRoot';
import BottomMenu from '../bottomMenu/BottomMenu';
import {connect} from 'react-redux';
import Track from '../track/Track';
import Authorization from '../authorization/Authorization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  setUser,
  setLoading,
  setTrackedOrders,
  setFavourites,
} from '../../redux/Reducers';
import axios from 'axios';
import Api from '../extensions/Api';
import _ from 'lodash';
import Messages from '../Messages/Messages';

function mapStateToProps(state) {
  return {
    bottomMenu: state.bottomMenuReducer,
    user: state.userReducer,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setUser: user => dispatch(setUser(user)),
    setLoading: (opened, done) => dispatch(setLoading(opened, done)),
    setFavourites: favourites => dispatch(setFavourites(favourites)),
    setTrackedOrders: trackedOrders =>
      dispatch(setTrackedOrders(trackedOrders)),
  };
}

function Root({
  bottomMenu,
  setUser,
  setLoading,
  user,
  setTrackedOrders,
  setFavourites,
}) {
  async function getUser() {
    setLoading(true, false);
    try {
      const authToken = await AsyncStorage.getItem('authToken');

      if (authToken) {
        const response = await axios.get(Api.clients.me, {
          headers: {'x-auth-token': authToken},
        });

        const favourites = JSON.parse(await AsyncStorage.getItem('favourites'));

        if (favourites !== null) {
          setFavourites(favourites);
        }

        setTrackedOrders(response.data.orders);

        setUser({
          ...response.data.client,
          authToken: authToken,
        });
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(true, true);
  }

  useEffect(() => {
    getUser();
  }, []);
  
  return (
    <View style={styles.root}>
      {user._id && user.authToken ? (
        <>
          <SubRoot user={user} />
          {bottomMenu.opened && <BottomMenu bottomMenu={bottomMenu} />}
          <Track />
          {user.notification?.messages?.length > 0 && <Messages />}
        </>
      ) : (
        <Authorization />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Root);
