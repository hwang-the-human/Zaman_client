import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import colors from '../extensions/Colors';

export default function NavigateButton({title, subTitle, icon, handleClick}) {
  return (
    <TouchableOpacity onPress={handleClick}>
      <View style={styles.navigateButton}>
        {icon}
        <View style={styles.navigateButton__container}>
          <View style={styles.navigateButton__titleBox}>
            <Text style={styles.navigateButton__title}>{title}</Text>
            {subTitle && (
              <Text
                style={{color: subTitle === 'Не указано' ? colors.red : 'grey'}}
                numberOfLines={1}>
                {subTitle}
              </Text>
            )}
          </View>
          <SimpleLineIcons name="arrow-right" size={18} color="grey" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  navigateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },

  navigateButton__container: {
    flex: 1,
    marginLeft: 15,
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.2,
    borderBottomColor: 'grey',
    paddingTop: 15,
    paddingBottom: 15,
  },

  navigateButton__titleBox: {
    flex: 1,
  },

  navigateButton__title: {
    fontSize: 16,
  },
});
