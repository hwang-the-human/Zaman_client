import React from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const windowWidth = Dimensions.get('window').width;

export default function DishItemSkeleton() {
  return (
    <View style={styles.dishItemSkeleton}>
      <View style={styles.dishItemSkeleton__container}>
        <SkeletonPlaceholder>
          <View style={styles.dishItemSkeleton__skeletonBox}>
            <View style={styles.dishItemSkeleton__infoBox}>
              <View style={styles.dishItemSkeleton__title} />
              <View style={styles.dishItemSkeleton__text} />
              <View style={styles.dishItemSkeleton__price} />
            </View>
            <View style={styles.dishItemSkeleton__image} />
          </View>
        </SkeletonPlaceholder>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dishItemSkeleton: {
    width: '100%',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 15,
  },

  dishItemSkeleton__container: {
    width: windowWidth - 30,
  },

  dishItemSkeleton__skeletonBox: {
    width: windowWidth - 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  dishItemSkeleton__infoBox: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  dishItemSkeleton__title: {
    borderRadius: 5,
    height: 20,
    width: windowWidth * 0.4,
  },

  dishItemSkeleton__text: {
    borderRadius: 5,
    height: 40,
    width: windowWidth * 0.6,
  },

  dishItemSkeleton__price: {
    borderRadius: 5,
    height: 20,
    width: windowWidth * 0.2,
  },

  dishItemSkeleton__image: {
    borderRadius: 10,
    width: 100,
    height: 100,
  },
});
