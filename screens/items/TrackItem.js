import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import colors from '../extensions/Colors';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {useNavigation} from '@react-navigation/native';
import currencyFormatter from 'currency-formatter';

const windowWidth = Dimensions.get('window').width;

export default function TrackItem({track, history}) {
  const navigation = useNavigation();

  function handleOpen() {
    navigation.navigate('TrackOrder', {
      track: track,
      history: history,
    });
  }

  return (
    <TouchableOpacity onPress={handleOpen}>
      <View style={styles.trackItem}>
        <View style={styles.trackItem__container}>
          <View style={styles.trackItem__imageBox}>
            <Image
              style={styles.trackItem__image}
              source={{
                uri: track.restaurant.image,
              }}
            />
            <View style={styles.trackItem__titleBox}>
              <Text style={styles.trackItem__title} numberOfLines={1}>
                {track.restaurant?.title}
              </Text>
              <Text style={styles.trackItem__subTitle} numberOfLines={1}>
                {track.orders?.length} покупки
              </Text>
              <Text style={styles.trackItem__priceText} numberOfLines={1}>
                {currencyFormatter.format(track.total_price, {
                  symbol: 'тг',
                  thousand: ',',
                  precision: 0,
                  format: '%v %s',
                })}
              </Text>
            </View>
          </View>

          <SimpleLineIcons
            style={styles.trackItem__icon}
            name="arrow-right"
            size={18}
            color="grey"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  trackItem: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  trackItem__container: {
    flexDirection: 'row',
    width: windowWidth - 30,
    borderBottomWidth: 0.2,
    borderColor: 'grey',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 15,
  },

  trackItem__imageBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },

  trackItem__image: {
    width: 90,
    height: 90,
    borderRadius: 15,
  },

  trackItem__titleBox: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },

  trackItem__title: {
    fontSize: 18,
    fontWeight: '600',
  },

  trackItem__subTitle: {
    color: 'grey',
    fontWeight: '500',
    marginTop: 4,
    marginBottom: 4,
  },

  trackItem__priceText: {
    color: colors.green,
    fontWeight: '500',
    fontSize: 16,
  },

  trackItem__icon: {},
});
