import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import TrackItem from '../items/TrackItem';

export default function ScrollList({trackedOrders}) {
  return (
    <ScrollView style={styles.scrollList} scrollEventThrottle={16}>
      <View style={styles.scrollList__space} />
      {trackedOrders.map((track, i) => (
        <TrackItem track={track} history={false} key={i} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollList: {},

  scrollList__space: {
    height: 15,
    width: '100%',
  },
});
