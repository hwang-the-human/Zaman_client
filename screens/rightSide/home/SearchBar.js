import React, {useState} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  TouchableWithoutFeedback,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  Easing,
  withSpring,
  useAnimatedProps,
} from 'react-native-reanimated';
import ClearIcon from 'react-native-vector-icons/FontAwesome';
import colors from '../../extensions/Colors';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import {useNavigation} from '@react-navigation/native';

Animated.addWhitelistedNativeProps({inputText: true});
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const windowWidth = Dimensions.get('window').width;

export default function SearchBar({
  textInputRef,
  inputText,
  textIsEmpty,
  isFocused,
  setIsFocused,
  handleSearch,
  isTop_list,
  setOpenOptions,
  handleUnfocus,
  setCafeItems,
}) {
  const navigation = useNavigation();
  const [textWidth, setTextWidth] = useState(0);

  function handleOpenLeftSide() {
    navigation.openDrawer();
  }

  function handleFocus() {
    if (!isFocused.value) {
      setCafeItems([]);
      setIsFocused(true);
      setOpenOptions(true);
      isTop_list.value = false;
    }
  }

  function handleClearInput() {
    textInputRef.current.clear();
    textIsEmpty.value = true;
  }

  const config = {
    duration: 300,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };

  const clearIconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: textIsEmpty.value ? withTiming(0) : withSpring(1),
        },
      ],
    };
  }, [textIsEmpty.value]);

  const cancelButtonStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isFocused ? 1 : 0, config),
      width: withTiming(isFocused ? textWidth : 0, config),
    };
  });

  const inputTextProps = useAnimatedProps(() => {
    return {text: inputText.value};
  });

  return (
    <View style={styles.searchBar}>
      <TouchableOpacity
        style={styles.searchBar__iconButton}
        onPress={handleOpenLeftSide}>
        <AntDesign name="menu-fold" size={25} color="black" />
      </TouchableOpacity>
      <View style={styles.searchBar__textInputBox}>
        <AntDesign
          name="search1"
          style={styles.searchBar__searchIcon}
          size={20}
          color="grey"
        />
        <AnimatedTextInput
          style={styles.searchBar__textInput}
          ref={textInputRef}
          onChangeText={text => {
            inputText.value = text;
            if (text === '') {
              textIsEmpty.value = true;
            } else {
              textIsEmpty.value = false;
            }
          }}
          animatedProps={inputTextProps}
          onSubmitEditing={() => handleSearch(inputText.value)}
          onFocus={handleFocus}
          returnKeyType="search"
          placeholderTextColor="grey"
          placeholder="Поиск"
          maxLength={50}
        />
        <TouchableWithoutFeedback onPress={handleClearInput}>
          <Animated.View style={[styles.searchBar__clearIcon, clearIconStyle]}>
            <ClearIcon name="close" size={14} color="black" />
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
      <TouchableOpacity onPress={handleUnfocus}>
        <Animated.View
          style={[styles.searchBar__cancelButton, cancelButtonStyle]}>
          <Text
            style={{color: colors.blue}}
            numberOfLines={1}
            ellipsizeMode="clip">
            Отмена
          </Text>
        </Animated.View>
      </TouchableOpacity>
      <Text
        style={{position: 'absolute', transform: [{scale: 0}]}}
        onLayout={event => {
          if (textWidth === 0) {
            setTextWidth(event.nativeEvent.layout.width + 15);
          }
        }}>
        Отмена
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    position: 'absolute',
    bottom: 15,
    overflow: 'hidden',
    width: windowWidth - 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  searchBar__iconButton: {
    marginRight: 15,
  },

  searchBar__cancelButton: {
    overflow: 'hidden',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },

  searchBar__textInputBox: {
    backgroundColor: colors.lightGrey,
    flexDirection: 'row',
    overflow: 'hidden',
    flex: 1,
    height: 40,
    borderRadius: 30,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },

  searchBar__searchIcon: {
    paddingRight: 10,
    paddingLeft: 10,
  },

  searchBar__textInput: {
    flex: 1,
    height: '100%',
  },

  searchBar__clearIcon: {
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
    width: 24,
    height: 24,
    borderRadius: 24,
  },
});
