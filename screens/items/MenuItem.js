import React from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import {TouchableHighlight} from 'react-native-gesture-handler';

export default function MenuItem({icon, title, handleTouch}) {
  return (
    <TouchableHighlight
      style={styles.menuItem}
      underlayColor="rgba(0,0,0,0.1)"
      onPress={() => handleTouch(title)}>
      <View style={styles.menuItem__container}>
        {icon}
        <Text style={styles.menuItem__title}>{title}</Text>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  menuItem: {
    height: 60,
    justifyContent: 'center',
  },

  menuItem__container: {
    marginLeft: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },

  menuItem__title: {
    fontSize: 16,
    marginLeft: 10,
  },
});
