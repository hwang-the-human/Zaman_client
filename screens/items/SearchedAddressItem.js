import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableHighlight,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const windowWidth = Dimensions.get('window').width;

export default function SearchedAddressItem({
  title,
  subTitle,
  icon,
  handleSelectStreet,
}) {
  return (
    <TouchableHighlight onPress={() => handleSelectStreet(title)}>
      <View style={styles.searchedAddressItem}>
        <View style={styles.searchedAddressItem__container}>
          {icon ? (
            icon
          ) : (
            <Ionicons name="location-outline" size={30} color="black" />
          )}
          <View style={styles.searchedAddressItem__textBox}>
            <Text style={styles.searchedAddressItem__title}>{title}</Text>
            <Text style={styles.searchedAddressItem__subTitle}>{subTitle}</Text>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  searchedAddressItem: {
    backgroundColor: 'white',
    alignItems: 'center',
  },

  searchedAddressItem__container: {
    flexDirection: 'row',
    height: 60,
    width: windowWidth - 30,
    alignItems: 'center',
  },

  searchedAddressItem__textBox: {
    marginLeft: 15,
    borderBottomWidth: 0.2,
    flex: 1,
    height: '100%',
    justifyContent: 'center',
  },

  searchedAddressItem__title: {
    fontSize: 16,
    fontWeight: '500',
  },

  searchedAddressItem__subTitle: {
    color: 'grey',
  },
});
