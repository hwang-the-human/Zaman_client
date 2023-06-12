import React from 'react';
import {StyleSheet, Text, View, Dimensions, Linking} from 'react-native';
import colors from '../../../extensions/Colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomButton from '../../../extensions/CustomButton';
import phoneFormatter from 'phone-formatter';

const windowWidth = Dimensions.get('window').width;

export default function Info({cafe}) {
  function handleOpenMap() {
    Linking.openURL('https://m.2gis.kz/search/' + cafe.address);
  }

  function handleCallCafe() {
    Linking.openURL(`tel:${cafe.phone}`);
  }

  return (
    <View style={styles.info}>
      <View style={styles.info__container}>
        <View style={styles.info__option}>
          <MaterialIcons name="store" size={30} color="grey" />
          <View style={styles.info__buttonBox}>
            <View style={styles.info__titleBox}>
              <Text style={styles.info__text}>{cafe.address}</Text>
            </View>
            <CustomButton handleButton={handleOpenMap}>
              <View style={styles.info__button}>
                <Text style={styles.info__textButton}>Карта</Text>
              </View>
            </CustomButton>
          </View>
        </View>

        <View style={styles.info__option}>
          <MaterialIcons name="call" size={30} color="grey" />
          <View style={styles.info__buttonBox}>
            <View style={styles.info__titleBox}>
              <Text style={styles.info__text}>
                {phoneFormatter.format(cafe.phone, '+7 (NNN) NNN-NN-NN')}
              </Text>
            </View>
            <CustomButton handleButton={handleCallCafe}>
              <View style={styles.info__button}>
                <Text style={styles.info__textButton}>Позвонить</Text>
              </View>
            </CustomButton>
          </View>
        </View>

        <View style={styles.info__option}>
          <MaterialCommunityIcons
            name="clock-time-five"
            size={30}
            color="grey"
          />
          <View style={styles.info__buttonBox}>
            <Text style={styles.info__text}>
              {cafe.status.time.map(
                (time, i) =>
                  time + (i < cafe.status.time.length - 1 ? ', ' : '.'),
              )}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  info: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },

  info__container: {
    width: windowWidth - 30,
  },

  info__option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  info__buttonBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    paddingTop: 15,
    paddingBottom: 15,

    borderBottomColor: 'grey',
    borderBottomWidth: 0.2,
  },

  info__titleBox: {
    flex: 1,
    justifyContent: 'center',
  },

  info__text: {
    fontSize: 16,
    marginRight: 15,
  },

  info__button: {
    backgroundColor: colors.green,
    padding: 10,
    borderRadius: 100,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },

  info__textButton: {
    color: 'white',
    fontWeight: '500',
  },
});
