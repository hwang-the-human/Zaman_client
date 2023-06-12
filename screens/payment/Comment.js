import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  StatusBar,
} from 'react-native';
import colors from '../extensions/Colors';
import {useHeaderHeight} from '@react-navigation/elements';
import {useNavigation} from '@react-navigation/native';
import MainButton from '../extensions/MainButton';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Comment() {
  const headerHeight = useHeaderHeight();
  const navigation = useNavigation();
  const [text, onChangeText] = useState('');

  function handleSave() {
    navigation.goBack();
  }
  return (
    <KeyboardAvoidingView
      style={styles.comment}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={headerHeight + StatusBar.currentHeight}>
      <Text style={styles.comment__title}>
        Укажите ресторану, что необходимо учесть при приготовлении
      </Text>
      <View style={styles.comment__textInputBox}>
        <TextInput
          style={styles.comment__textInput}
          onChangeText={onChangeText}
          value={text}
          multiline={true}
          autoFocus={true}
          maxLength={200}
          placeholder="Особые запросы, аллергии, ограничения по диете и тд."
        />
      </View>

      <MainButton
        title={'Сохранить'}
        handlePress={handleSave}
        marginBottom={30}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  comment: {
    flex: 1,
    backgroundColor: colors.lightGrey,
    alignItems: 'center',
  },

  comment__title: {
    width: windowWidth - 30,
    marginTop: 30,
    marginBottom: 15,
    fontSize: 16,
    fontWeight: '600',
  },

  comment__textInputBox: {
    flex: 1,
    backgroundColor: 'white',
    width: windowWidth - 30,
    padding: 15,
    borderRadius: 15,
    marginBottom: 30,
  },

  comment__textInput: {
    fontSize: 16,
    width: '100%',
  },
});
