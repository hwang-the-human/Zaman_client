import React from 'react';
import {StyleSheet, Text, View, SafeAreaView, Image, Alert} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import colors from '../extensions/Colors';
import MenuItem from '../items/MenuItem';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';
import {clearStore, setLoading} from '../../redux/Reducers';

function mapStateToProps(state) {
  return {
    user: state.userReducer,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    clearStore: () => dispatch(clearStore()),
    setLoading: (opened, done) => dispatch(setLoading(opened, done)),
  };
}

function LeftSide({user, clearStore, setLoading}) {
  const navigation = useNavigation();
  const translationY = useSharedValue(0);

  function handleNavigateScreen(screen) {
    navigation.navigate(screen);
  }

  function handleExit() {
    Alert.alert('Выйти', 'Вы действительно хотите выйти?', [
      {
        text: 'Отмена',
        style: 'cancel',
      },
      {
        text: 'Да',
        onPress: async () => {
          setLoading(true, false);
          try {
            AsyncStorage.clear();
            clearStore();
          } catch (error) {
            console.log(error);
          }
          setLoading(true, true);
        },
      },
    ]);
  }

  const scrollHandler = useAnimatedScrollHandler(event => {
    translationY.value = event.contentOffset.y;
  });

  return (
    <SafeAreaView style={styles.leftSide}>
      <View style={styles.leftSide__topBox}>
        <Ionicons
          style={styles.leftSide__icon}
          name="person-circle-sharp"
          size={70}
          color="grey"
        />
        <Text style={styles.leftSide__name}>
          {user.name} {user.surname}
        </Text>
        <Text style={styles.leftSide__subName}>#{user._id.substr(-4)}</Text>
        {/* <View style={styles.leftSide__titleBox}>
          <Text style={styles.leftSide__title}>356 </Text>
          <Text style={styles.leftSide__subTitle}>Успешных доставок!</Text>
        </View> */}
      </View>

      <Animated.ScrollView onScroll={scrollHandler} scrollEventThrottle={16}>
        <MenuItem
          icon={<AntDesign name="home" size={30} color="grey" />}
          title={'Главная'}
          handleTouch={handleNavigateScreen}
        />
        <MenuItem
          icon={<AntDesign name="hearto" size={30} color="grey" />}
          title={'Избранные'}
          handleTouch={handleNavigateScreen}
        />
        <MenuItem
          icon={<AntDesign name="book" size={30} color="grey" />}
          title={'История Заказов'}
          handleTouch={handleNavigateScreen}
        />
        <View style={styles.leftSide__bottomBox}>
          <MenuItem
            icon={<Ionicons name="settings-outline" size={30} color="grey" />}
            title={'Настройки'}
            handleTouch={handleNavigateScreen}
          />
          <MenuItem
            icon={<MaterialIcons name="support-agent" size={30} color="grey" />}
            title={'Служба поддержки'}
            handleTouch={handleNavigateScreen}
          />
          <MenuItem
            icon={<AntDesign name="logout" size={30} color="grey" />}
            title={'Выйти'}
            handleTouch={handleExit}
          />
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  leftSide: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    zIndex: 100,
  },

  leftSide__topBox: {
    borderBottomColor: colors.grey,
    borderBottomWidth: 0.2,
  },

  leftSide__icon: {
    marginLeft: 15,
    marginTop: 20,
    marginBottom: 10,
  },

  leftSide__name: {
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 15,
  },

  leftSide__subName: {
    marginBottom: 15,
    marginLeft: 15,
    fontSize: 16,
    color: 'grey',
  },

  leftSide__titleBox: {
    flexDirection: 'row',
    marginBottom: 15,
    marginLeft: 15,
  },

  leftSide__title: {
    fontWeight: '600',
    fontSize: 16,
  },

  leftSide__subTitle: {
    fontSize: 16,
    color: 'grey',
  },

  leftSide__bottomBox: {
    borderTopColor: colors.grey,
    borderTopWidth: 0.2,
    width: '100%',
    paddingTop: 20,
    marginTop: 20,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(LeftSide);
