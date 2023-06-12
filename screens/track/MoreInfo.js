import React from 'react';
import {StyleSheet, Text, View, Dimensions, Linking} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../extensions/CustomButton';
import colors from '../extensions/Colors';

const windowWidth = Dimensions.get('window').width;

export default function MoreInfo({track}) {
  function handleCallCafe() {
    Linking.openURL(`tel:${track.restaurant.phone}`);
  }

  function handleCallCourier() {
    Linking.openURL(`tel:${track.courier.phone}`);
  }

  return (
    <View style={styles.moreInfo}>
      <View style={styles.moreInfo__container}>
        <Text style={styles.moreInfo__title}>Дополнительная информация</Text>

        <View style={styles.moreInfo__option}>
          <MaterialIcons name="store" size={30} color="grey" />
          <View style={styles.moreInfo__buttonBox}>
            <View style={styles.moreInfo__titleBox}>
              <Text style={styles.moreInfo__text}>Ресторан</Text>
              <Text style={styles.moreInfo__subText}>
                {track.restaurant.title}
              </Text>
            </View>
            <CustomButton handleButton={handleCallCafe}>
              <View style={styles.moreInfo__callButton}>
                <Text style={styles.moreInfo__textButton}>Позвонить</Text>
              </View>
            </CustomButton>
          </View>
        </View>

        <View style={styles.moreInfo__option}>
          <MaterialIcons name="delivery-dining" size={30} color="grey" />
          <View style={styles.moreInfo__buttonBox}>
            <View style={styles.moreInfo__titleBox}>
              <Text style={styles.moreInfo__text}>Курьер</Text>
              <Text style={styles.moreInfo__subText}>
                {track.courier ? track.courier.name : 'Не указан'}
              </Text>
            </View>
            <CustomButton
              handleButton={handleCallCourier}
              disabled={track.courier ? false : true}>
              <View style={styles.moreInfo__callButton}>
                <Text style={styles.moreInfo__textButton}>Позвонить</Text>
              </View>
            </CustomButton>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  moreInfo: {
    alignItems: 'center',
    marginTop: 30,
  },

  moreInfo__container: {
    width: windowWidth - 30,
  },

  moreInfo__title: {
    marginBottom: 15,
    fontSize: 25,
    fontWeight: '600',
  },

  moreInfo__option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  moreInfo__buttonBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: 'grey',
    borderBottomWidth: 0.2,
    marginLeft: 15,
    paddingTop: 15,
    paddingBottom: 15,
  },

  moreInfo__titleBox: {
    flex: 1,
    justifyContent: 'center',
  },

  moreInfo__text: {
    fontSize: 16,
  },

  moreInfo__subText: {
    color: 'grey',
  },

  moreInfo__callButton: {
    backgroundColor: colors.green,
    padding: 10,
    borderRadius: 30,
  },

  moreInfo__textButton: {
    color: 'white',
    fontWeight: '500',
  },
});
