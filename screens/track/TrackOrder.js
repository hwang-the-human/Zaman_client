import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ProgressOrder from './ProgressOrder';
import {ScrollView} from 'react-native-gesture-handler';
import Zigzag from '../extensions/Zigzag';
import Summary from '../payment/Summary';
import Orders from './Orders';
import Info from './Info';
import MoreInfo from './MoreInfo';
import {useRoute} from '@react-navigation/native';

export default function TrackOrder() {
  const {params} = useRoute();

  return (
    <ScrollView scrollEventThrottle={16}>
      <View style={styles.trackOrder}>
        {!params.history && <ProgressOrder track={params.track} />}
        <Orders track={params.track} />
        <Info track={params.track} />
        <MoreInfo track={params.track} />
        <Zigzag />
      </View>
      <Summary totalPrice={params.track.total_price} delPrice={300} />
      <View style={{width: '100%', height: 50}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  trackOrder: {
    backgroundColor: 'white',
    paddingBottom: 30,
  },
});
