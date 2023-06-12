import React from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import currencyFormatter from 'currency-formatter';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Summary({totalPrice, delPrice}) {
  return (
    <View style={styles.summary}>
      <View style={styles.summary__container}>
        <Text style={styles.summary__title}>Сводная информация</Text>
        <View style={styles.summary__option}>
          <Text style={styles.summary__text}>Продукты</Text>
          <Text style={styles.summary__text}>
            {currencyFormatter.format(totalPrice, {
              symbol: 'тг',
              thousand: ',',
              precision: 0,
              format: '%v %s',
            })}
          </Text>
        </View>
        <View style={styles.summary__option}>
          <Text style={styles.summary__text}>Доставка</Text>
          <Text style={styles.summary__text}>
            {currencyFormatter.format(delPrice, {
              symbol: 'тг',
              thousand: ',',
              precision: 0,
              format: '%v %s',
            })}
          </Text>
        </View>
        <View style={styles.summary__option}>
          <Text style={styles.summary__title}>ВСЕГО</Text>
          <Text style={styles.summary__title}>
            {currencyFormatter.format(totalPrice + delPrice, {
              symbol: 'тг',
              thousand: ',',
              precision: 0,
              format: '%v %s',
            })}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  summary: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  summary__container: {
    width: windowWidth - 30,
    paddingTop: 50,
    paddingBottom: 50,
  },

  summary__title: {
    fontSize: 25,
    fontWeight: '600',
  },

  summary__option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },

  summary__text: {
    fontSize: 18,
  },
});
