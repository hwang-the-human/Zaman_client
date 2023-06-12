import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  runOnJS,
  withSequence,
  withTiming,
  Easing,
  withDelay,
  withRepeat,
} from 'react-native-reanimated';
import * as Progress from 'react-native-progress';
import {connect} from 'react-redux';
import {setLoading} from '../../redux/Reducers';

function mapStateToProps(state) {
  return {
    loading: state.loadingReducer,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setLoading: (opened, done) => dispatch(setLoading(opened, done)),
  };
}

function Loading({loading, setLoading}) {
  const config = {
    duration: 500,
  };

  function closeLoading() {
    setLoading(false, false);
  }

  const loadingStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: 'rgba(0,0,0,0.3)',
      opacity: loading.done
        ? withTiming(0, config, () => {
            runOnJS(closeLoading)();
          })
        : withSequence(withTiming(0, {duration: 0}), withTiming(1, config)),
    };
  }, [loading.done]);

  return (
    <Animated.View style={[styles.loading, loadingStyle]}>
      <Progress.Circle
        size={100}
        indeterminate={true}
        color={'white'}
        borderWidth={3}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  loading: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Loading);
