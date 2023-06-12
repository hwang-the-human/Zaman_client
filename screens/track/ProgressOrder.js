import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import colors from '../extensions/Colors';
import moment from 'moment';

const windowWidth = Dimensions.get('window').width;

export default function ProgressOrder({track}) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const now = moment(new Date());
    const late = moment(track.date);
    const seconds = 1200 - now.diff(late, 'seconds');

    if (seconds > 0) {
      setTime(seconds);
    }
  }, []);

  useEffect(() => {
    if (time < 1) return;

    const intervalId = setInterval(() => {
      setTime(time - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [time]);

  return (
    <View style={styles.progressOrder}>
      <View style={styles.progressOrder__container}>
        <View style={styles.progressOrder__titleBox}>
          <Text style={styles.progressOrder__title}>
            Отслеживание заказа{' '}
            <Text style={{fontSize: 16, color: 'grey'}}>
              #{track._id.substr(-4)}
            </Text>
          </Text>
          <Text style={styles.progressOrder__subTitle}>
            Приблизительное время ожидания:{' '}
            <Text style={styles.progressOrder__timeText}>
              {moment.utc(time * 1000).format('mm:ss')}
            </Text>
          </Text>
        </View>
        <View style={styles.progressOrder__step}>
          <View
            style={[
              styles.progressOrder__circle,
              {backgroundColor: colors.green},
            ]}>
            <MaterialIcons name="store" size={30} color={colors.lightGreen} />
          </View>
          <Text
            style={[
              styles.progressOrder__circleText,
              {color: time >= 600 ? colors.green : 'grey'},
            ]}>
            Готовится
          </Text>
        </View>

        <View style={styles.progressOrder__lineBox}>
          <View
            style={[
              styles.progressOrder__line,
              {backgroundColor: time < 600 ? colors.green : 'grey'},
            ]}
          />
        </View>

        <View style={styles.progressOrder__step}>
          <View
            style={[
              styles.progressOrder__circle,
              {backgroundColor: time < 600 ? colors.green : 'grey'},
            ]}>
            <MaterialIcons
              name="delivery-dining"
              size={30}
              color={colors.lightGreen}
            />
          </View>
          <Text
            style={[
              styles.progressOrder__circleText,
              {color: time < 600 && time > 0 ? colors.green : 'grey'},
            ]}>
            В пути
          </Text>
        </View>

        <View style={styles.progressOrder__lineBox}>
          <View
            style={[
              styles.progressOrder__line,
              {backgroundColor: time < 1 ? colors.green : 'grey'},
            ]}
          />
        </View>

        <View style={styles.progressOrder__step}>
          <View
            style={[
              styles.progressOrder__circle,
              {backgroundColor: time < 1 ? colors.green : 'grey'},
            ]}>
            <FontAwesome name="home" size={30} color={colors.lightGreen} />
          </View>
          <Text
            style={[
              styles.progressOrder__circleText,
              {color: time < 1 ? colors.green : 'grey'},
            ]}>
            Доставлено
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  progressOrder: {
    paddingTop: 30,
    alignItems: 'center',
  },

  progressOrder__container: {
    width: windowWidth - 30,
  },

  progressOrder__titleBox: {
    marginBottom: 15,
  },

  progressOrder__title: {
    fontSize: 25,
    fontWeight: '600',
  },

  progressOrder__subTitle: {
    color: 'grey',
  },

  progressOrder__timeText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '500',
  },

  progressOrder__step: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  progressOrder__lineBox: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  progressOrder__line: {
    width: 5,
    height: 50,
    borderRadius: 5,
    marginTop: 15,
    marginBottom: 15,
  },

  progressOrder__circle: {
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  progressOrder__circleText: {
    marginLeft: 15,
    fontSize: 16,
    fontWeight: '500',
  },

  progressOrder__time: {
    marginTop: 15,
    fontSize: 30,
    fontWeight: '600',
  },
});
