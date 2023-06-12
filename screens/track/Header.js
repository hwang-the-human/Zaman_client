import React from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import {useHeaderHeight} from '@react-navigation/elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import HeaderButton from '../rightSide/home/cafe/HeaderButton';
import colors from '../extensions/Colors';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const ICON_SIZE = 20;

export default function Header({opened, setOpened, config}) {
  const headerHeight = useHeaderHeight();

  function handleCloseTrack() {
    setOpened(false);
  }

  return (
    <View style={styles.header}>
      <View style={styles.header__container}>
        <HeaderButton
          icon={<FontAwesome name="close" size={ICON_SIZE} color="white" />}
          opened={opened}
          handleClick={handleCloseTrack}
          config={config}
          delay={config.duration * 2}
        />
        <Text style={styles.header__title}>Ваши заказы</Text>
        <View style={styles.header__space} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 100,
    borderBottomWidth: 0.2,
    borderColor: 'grey',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  header__container: {
    width: windowWidth - 30,
    flexDirection: 'row',
    marginBottom: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  header__title: {
    fontWeight: 'bold',
    fontSize: 18,
  },

  header__space: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
});
