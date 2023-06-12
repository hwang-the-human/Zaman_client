import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  Easing,
  withTiming,
} from 'react-native-reanimated';
import colors from '../extensions/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

export default function AddressItem({
  address,
  changeMode,
  currentOrder,
  saveDefaultAddress,
  selectedIdAddresses,
  setSelectedIdAddresses,
}) {
  const checkmark = useSharedValue(false);

  function handleCheckMark() {
    if (changeMode) {
      if (checkmark.value) {
        setSelectedIdAddresses(
          selectedIdAddresses.filter(a => {
            return a !== address._id;
          }),
        );
        checkmark.value = false;
      } else {
        setSelectedIdAddresses([...selectedIdAddresses, address._id]);
        checkmark.value = true;
      }
    } else {
      saveDefaultAddress(address);
    }
  }

  useEffect(() => {
    if (changeMode) {
      checkmark.value = false;
    }
  }, [changeMode]);

  const config = {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };

  const checkmarkStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: currentOrder.address?._id === address._id ? withSpring(1) : 0,
        },
      ],
    };
  }, [currentOrder.address?._id]);

  const cardItemStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: withTiming(changeMode ? 0 : -40, config)}],
    };
  }, [changeMode]);

  const selectedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: checkmark.value ? 1 : 0}],
    };
  }, [checkmark]);

  return (
    <TouchableWithoutFeedback onPress={handleCheckMark}>
      <Animated.View style={[styles.cardItem, cardItemStyle]}>
        <View style={styles.cardItem__selectionBox}>
          <View style={styles.cardItem__unselected} />
          <Animated.View style={[styles.cardItem__selected, selectedStyle]}>
            <Entypo name="check" size={20} color={colors.darkRed} />
          </Animated.View>
        </View>

        <View style={styles.cardItem__container}>
          <AntDesign
            style={styles.cardItem__cardIcon}
            name="home"
            size={30}
            color="black"
          />
          <View style={styles.cardItem__titleBox}>
            <View>
              <Text style={styles.cardItem__title}>{address.street}</Text>
              <Text style={styles.cardItem__subTitle}>{address.aptNumber}</Text>
            </View>
            <Animated.View
              style={[styles.cardItem__checkmarkIcon, checkmarkStyle]}>
              <Entypo name="check" size={20} color={colors.green} />
            </Animated.View>
          </View>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  cardItem: {
    flexDirection: 'row',
    width: '100%',
  },

  cardItem__container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },

  cardItem__cardIcon: {
    marginRight: 15,
  },

  cardItem__titleBox: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.2,
    borderBottomColor: 'grey',
    paddingTop: 15,
    paddingBottom: 15,
  },

  cardItem__title: {
    fontSize: 16,
  },

  cardItem__subTitle: {
    color: 'grey',
  },

  cardItem__checkmarkIcon: {
    backgroundColor: colors.lightGreen,
    width: 25,
    height: 25,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardItem__selectionBox: {
    marginRight: 15,
    justifyContent: 'center',
  },

  cardItem__unselected: {
    width: 25,
    height: 25,
    borderRadius: 25,
    borderWidth: 1,
  },

  cardItem__selected: {
    position: 'absolute',
    width: 25,
    height: 25,
    borderRadius: 25,
    backgroundColor: colors.lightRed,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
