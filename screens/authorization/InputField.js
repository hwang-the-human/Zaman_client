import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  useAnimatedProps,
} from 'react-native-reanimated';
import PhoneInput from '../extensions/PhoneInput';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function InputField({
  inputRef,
  input,
  setInput,
  placeholder,
  icon,
  returnKey,
  autoFocus,
  nextRef,
  maxLength,
  submit,
  keyboardType,
  forPhone,
  secureTextEntry,
}) {
  const [isEmpty, setIEmpty] = useState(true);
  function handleSubmit() {
    if (nextRef) {
      nextRef.current.focus();
    } else {
      submit();
    }
  }

  function handleClearInput() {
    setIEmpty(true);
    setInput('');
  }

  function handleOnChange(text) {
    if (text.length > 0) {
      setIEmpty(false);
    } else {
      setIEmpty(true);
    }
    setInput(text);
  }

  const clearIconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: isEmpty ? withSpring(0) : withSpring(1),
        },
      ],
    };
  }, [isEmpty]);

  return (
    <View style={styles.inputField}>
      <View style={styles.inputField__icon}>{icon}</View>

      <View style={styles.inputField__textInputBox}>
        {forPhone ? (
          <View style={styles.inputField__phoneBox}>
            <Text style={styles.inputField__phoneText}>+7 </Text>
            <PhoneInput
              style={styles.inputField__textInput}
              autoFocus={autoFocus}
              value={input}
              onChange={handleOnChange}
            />
          </View>
        ) : (
          <TextInput
            style={styles.inputField__textInput}
            ref={inputRef}
            value={input}
            onChangeText={text => handleOnChange(text)}
            autoFocus={autoFocus}
            maxLength={maxLength}
            placeholder={placeholder}
            returnKeyType={returnKey}
            keyboardType={keyboardType}
            onSubmitEditing={handleSubmit}
            secureTextEntry={secureTextEntry}
            placeholderTextColor="grey"
          />
        )}

        <TouchableWithoutFeedback onPress={handleClearInput}>
          <Animated.View style={[styles.inputField__clearIcon, clearIconStyle]}>
            <FontAwesome name="close" size={14} color="black" />
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
  },

  inputField__icon: {
    marginLeft: 15,
    marginRight: 15,
  },

  inputField__textInputBox: {
    flexDirection: 'row',
    flex: 1,
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.2,
    borderBottomColor: 'grey',
  },

  inputField__textInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },

  inputField__phoneBox: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },

  inputField__phoneText: {
    fontSize: 16,
    fontWeight: '500',
  },

  inputField__clearIcon: {
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    marginLeft: 15,
    width: 24,
    height: 24,
    borderRadius: 24,
  },
});
