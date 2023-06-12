import React, {useState} from 'react';
import {TextInput} from 'react-native';

export default function PhoneInput({autoFocus, value, onChange, style}) {
  const [isBack, setIsBack] = useState(false);

  function insertChar(text, char, position) {
    for (let i = 0; i < char.length; i++) {
      text = [
        text.slice(0, position[i]),
        char[i],
        text.slice(position[i]),
      ].join('');
    }

    return text;
  }

  function changeText(text) {
    if (isBack) {
      switch (true) {
        case text.length === 6:
          text = text.replace(/[() ]/g, '');
          break;
        case text.length === 10 || text.length === 13:
          text = text.slice(0, -1);
          break;
        default:
          break;
      }
    } else {
      switch (true) {
        case text.length === 4:
          text = insertChar(text, ['(', ') '], [0, 4]);
          break;
        case text.length === 10:
          text = insertChar(text, ['-'], [9]);
          break;
        case text.length === 13:
          text = insertChar(text, ['-'], [12]);
          break;
        default:
          break;
      }
    }

    return text;
  }
  return (
    <TextInput
      style={style}
      value={value}
      onChangeText={text => {
        onChange(changeText(text));
      }}
      onKeyPress={e => {
        if (e.nativeEvent.key === 'Backspace') {
          setIsBack(true);
        } else {
          setIsBack(false);
        }
      }}
      caretHidden={true}
      selection={{start: value.length}}
      autoFocus={autoFocus}
      placeholder={'(701) 111-11-11'}
      placeholderTextColor="grey"
      keyboardType="phone-pad"
      maxLength={15}
    />
  );
}
