import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../../../extensions/Colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';
import {pushFavourite, removeFavourite} from '../../../../redux/Reducers';

function mapStateToProps(state) {
  return {
    favourites: state.favouritesReducer,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    pushFavourite: favourite => dispatch(pushFavourite(favourite)),
    removeFavourite: favourite => dispatch(removeFavourite(favourite)),
  };
}

function BottomBar({cafe, favourites, pushFavourite, removeFavourite}) {
  const [favourited, setFavourited] = useState(false);

  useEffect(() => {
    favourites.map(a => {
      if (a === cafe._id) {
        setFavourited(true);
      }
    });
  }, []);

  function handleFavourite() {
    if (favourited) {
      setFavourited(false);
      removeFavourite(cafe._id);
      AsyncStorage.setItem(
        'favourites',
        JSON.stringify(favourites.filter(a => a !== cafe._id)),
      );
    } else {
      setFavourited(true);
      pushFavourite(cafe._id);
      AsyncStorage.setItem(
        'favourites',
        JSON.stringify([...favourites, cafe._id]),
      );
    }
  }

  return (
    <View style={styles.bottomBar}>
      <View style={styles.bottomBar__topBox}>
        <View style={styles.bottomBar__titleBox}>
          <Text style={styles.bottomBar__title}>{cafe.title}</Text>
          <View style={styles.bottomBar__categoryBox}>
            {cafe.categories.map(
              (title, i) =>
                title !== 'Акции' && (
                  <Text style={styles.bottomBar__categoryText} key={i}>
                    {title}
                    {cafe.categories.length - 1 > i && ', '}
                  </Text>
                ),
            )}
          </View>
        </View>
        <TouchableWithoutFeedback onPress={handleFavourite}>
          {favourited ? (
            <AntDesign
              style={styles.bottomBar__likeIcon}
              name="heart"
              size={25}
              color={colors.red}
            />
          ) : (
            <AntDesign
              style={styles.bottomBar__likeIcon}
              name="hearto"
              size={25}
              color={colors.red}
            />
          )}
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.bottomBar__bottomBox}>
        <View style={styles.bottomBar__option}>
          <MaterialIcons name="delivery-dining" size={22} color={'grey'} />
          <Text style={styles.bottomBar__optionText}> 350 тг</Text>
        </View>
        <View style={styles.bottomBar__option}>
          <MaterialIcons name="access-time" size={22} color={'grey'} />
          <Text style={styles.bottomBar__optionText}> 20 мин</Text>
        </View>
        <View style={styles.bottomBar__option}>
          <MaterialIcons name="thumb-up" size={22} color={'grey'} />
          <Text style={styles.bottomBar__optionText}> 95%</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    backgroundColor: 'white',
    height: 80,
  },

  bottomBar__topBox: {
    flex: 2,
    borderColor: colors.grey,
    borderBottomWidth: 0.2,
    paddingLeft: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },

  bottomBar__titleBox: {
    justifyContent: 'center',
  },

  bottomBar__title: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
  },

  bottomBar__likeIcon: {
    paddingRight: 15,
  },

  bottomBar__categoryBox: {
    flexDirection: 'row',
  },

  bottomBar__categoryText: {
    color: 'grey',
    fontSize: 14,
  },

  bottomBar__bottomBox: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 15,
  },

  bottomBar__option: {
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottomBar__optionText: {
    color: 'black',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(BottomBar);
