import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import colors from './Colors';

const windowWidth = Dimensions.get('window').width;

export default function Header({title}) {
  const navigation = useNavigation();

  function handleOpenLeftSide() {
    navigation.openDrawer();
  }

  return (
    <View style={styles.header}>
      <View style={styles.header__container}>
        <TouchableOpacity
          style={styles.header__iconButton}
          onPress={handleOpenLeftSide}>
          <AntDesign name="menu-fold" size={25} color="black" />
        </TouchableOpacity>
        <Text style={styles.header__title}>{title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'white',
    height: 120,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
  },

  header__container: {
    justifyContent: 'center',
    height: 40,
    width: windowWidth - 30,
    marginBottom: 15,
  },

  header__title: {
    position: 'absolute',
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
