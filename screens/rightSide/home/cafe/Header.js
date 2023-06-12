import React from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import colors from '../../../extensions/Colors';
import HeaderButton from './HeaderButton';
import CategoryBar from './CategoryBar';

const windowWidth = Dimensions.get('window').width;

export default function Header({
  cafe,
  opened,
  titleY,
  config,
  handleCloseCafe,
  setSearchedListOpened,
  showCategoryBar,
  showHeader,
  categoryBarList,
  listRef,
  listCategoryLayout,
}) {
  function handleClose() {
    handleCloseCafe();
  }

  function handleOpenSearch() {
    setSearchedListOpened(true);
  }

  const containerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: showHeader.value ? 'white' : 'transparent',
    };
  }, [showHeader.value]);

  const titleStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: titleY.value}],
    };
  }, [titleY.value]);

  const categoriesBoxStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {scale: showHeader.value ? 1 : 0},
        {translateY: 1},
        // {translateY: withTiming(showCategoryBar.value ? 65 : 1, config)},
      ],
    };
  }, [showCategoryBar.value, showHeader.value]);

  return (
    <View style={styles.header}>
      <Animated.View style={[styles.header__container, containerStyle]}>
        <View style={styles.header__buttonsBox}>
          <HeaderButton
            icon={<FontAwesome name="close" size={20} color="white" />}
            handleClick={handleClose}
            opened={opened}
            config={config}
            delay={config.duration}
          />
          <Animated.Text style={[styles.header__title, titleStyle]}>
            {cafe.title}
          </Animated.Text>
          <HeaderButton
            icon={
              <AntDesign
                name="search1"
                style={styles.searchBar__searchIcon}
                size={20}
                color="white"
              />
            }
            handleClick={handleOpenSearch}
            opened={opened}
            config={config}
            delay={config.duration}
          />
        </View>
      </Animated.View>
      <Animated.View style={[styles.header__categoriesBox, categoriesBoxStyle]}>
        {/* {categoryBarList.length !== 0 && (
          <CategoryBar
            listRef={listRef}
            listCategoryLayout={listCategoryLayout}
            categoryBarList={categoryBarList}
          />
        )} */}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    alignItems: 'center',
    width: '100%',
    top: 0,
    height: 100,
    zIndex: 1,
  },

  header__container: {
    zIndex: 1,
    overflow: 'hidden',
    position: 'absolute',
    height: '100%',
    width: '100%',
    alignItems: 'center',
  },

  header__buttonsBox: {
    position: 'absolute',
    width: windowWidth - 30,
    bottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  header__title: {
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },

  header__categoriesBox: {
    backgroundColor: 'white',
    position: 'absolute',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
    bottom: 0,
    height: 65,
  },
});
