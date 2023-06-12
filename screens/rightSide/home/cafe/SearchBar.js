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
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  useAnimatedProps,
} from 'react-native-reanimated';
import colors from '../../../extensions/Colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';

Animated.addWhitelistedNativeProps({inputText: true});
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const windowWidth = Dimensions.get('window').width;

export default function SearchBar({
  opened,
  config,
  textInputRef,
  handleCloseScreen,
  setDishes,
  dishes,
  textIsEmpty,
  searching,
  setSearching,
}) {
  const [textWidth, setTextWidth] = useState(0);
  const inputText = useSharedValue('');

  function handleSearch() {
    if (!searching) {
      setSearching(true);
    }
    const newArray = [];
    for (let i = 0; i < dishes.length; i++) {
      if (
        dishes[i].title.toLowerCase().includes(inputText.value.toLowerCase())
      ) {
        newArray.push(dishes[i]);
      }
    }
    setDishes(newArray);
  }

  function handleFocus() {}

  function handleUnfocus() {
    handleCloseScreen();
  }

  function handleClearInput() {
    inputText.value = '';
    textInputRef.current.clear();
    textIsEmpty.value = true;
  }

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
      opacity: opened.value
        ? withDelay(config.duration, withTiming(1, config))
        : withTiming(0, config),
      width: opened.value
        ? withDelay(config.duration, withTiming(textWidth, config))
        : withTiming(0, config),
    };
  }, [opened.value, textWidth]);

  const inputTextProps = useAnimatedProps(() => {
    return {text: inputText.value};
  }, [inputText.value]);

  return (
    <View style={styles.searchBar}>
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
            handleSearch();
          }}
          animatedProps={inputTextProps}
          onSubmitEditing={handleSearch}
          onFocus={handleFocus}
          returnKeyType="search"
          placeholder="Поиск"
          placeholderTextColor="grey"
          autoFocus={true}
          maxLength={50}
        />
        <TouchableWithoutFeedback onPress={handleClearInput}>
          <Animated.View style={[styles.searchBar__clearIcon, clearIconStyle]}>
            <FontAwesome name="close" size={14} color="black" />
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
    alignSelf: 'center',
    height: 40,
    overflow: 'hidden',
    width: windowWidth - 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    height: '100%',
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
