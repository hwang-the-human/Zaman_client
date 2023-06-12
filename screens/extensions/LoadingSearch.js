import React from 'react';
import {
  StyleSheet,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import colors from './Colors';
import * as Progress from 'react-native-progress';

const windowHeight = Dimensions.get('window').height;

export default function LoadingSearch({loading, handlePress}) {
  const loadingSearchStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: loading.show ? 1 : 0}],
    };
  }, [loading.show]);

  return (
    <TouchableWithoutFeedback
      onPress={handlePress}
      disabled={loading.success ? true : false}>
      <Animated.View style={[styles.loadingSearch, loadingSearchStyle]}>
        {loading.success ? (
          <Progress.Circle
            size={70}
            indeterminate={true}
            color={colors.green}
            borderWidth={3}
          />
        ) : (
          <Text style={styles.LoadingSearch__title}>Ничего не найдено</Text>
        )}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  loadingSearch: {
    position: 'absolute',
    width: '100%',
    height: windowHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },

  LoadingSearch__title: {
    fontSize: 25,
    color: 'grey',
  },
});
