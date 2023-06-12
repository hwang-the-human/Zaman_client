import React from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const TRIANGLE_SIZE = 12;
const count = Math.round(windowWidth / TRIANGLE_SIZE);

export default function Zigzag() {
  return (
    <View style={styles.zigzag}>
      {[...Array(count)].map((a, i) => (
        <View key={i}>
          <View style={[styles.zigzag__triangle, styles.zigzag__borders]} />
          <View style={styles.zigzag__triangle} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  zigzag: {
    overflow: 'hidden',
    position: 'absolute',
    flexDirection: 'row',
    bottom: -TRIANGLE_SIZE,
    width: '100%',

    justifyContent: 'center',
    alignItems: 'center',
  },

  zigzag__triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: TRIANGLE_SIZE,
    borderRightWidth: TRIANGLE_SIZE,
    borderBottomWidth: TRIANGLE_SIZE,
    transform: [{rotate: '180deg'}],
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'white',
  },

  zigzag__borders: {
    position: 'absolute',
    top: 1,
    borderBottomColor: 'grey',
  },
});
