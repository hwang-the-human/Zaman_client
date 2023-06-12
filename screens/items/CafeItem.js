import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View, Image, Dimensions} from 'react-native';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  runOnJS,
  useAnimatedReaction,
  Easing,
  withTiming,
  withSequence,
  useAnimatedRef,
  withDelay,
} from 'react-native-reanimated';
import {TapGestureHandler} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import BottomBar from '../rightSide/home/cafe/BottomBar';
import {setCafe} from '../../redux/Reducers';

function mapStateToProps(state) {
  return {
    cafe: state.cafeReducer,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setCafe: cafe => dispatch(setCafe(cafe)),
  };
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function CafeItem({cafeItem, cafe, setCafe}) {
  const scale = useSharedValue(1);
  const cafeItemRef = useRef();

  function updateAdditionScreen() {
    cafeItemRef.current.measure((x, y, width, height, pageX, pageY) => {
      setCafe({
        cafe: cafeItem,
        layout: {pageX: pageX, pageY: pageY},
        opened: true,
      });
    });
  }

  const config = {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };

  useEffect(() => {
    if (cafe.cafe && cafe.cafe._id === cafeItem._id) {
      scale.value = 0;
    } else {
      scale.value = 1;
    }
  }, [cafe]);

  const panGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      scale.value = withSpring(0.9);
    },
    onFail: (e, ctx) => {
      scale.value = withSpring(1);
    },
    onEnd: _ => {
      scale.value = withSpring(1, null, () => {
        runOnJS(updateAdditionScreen)();
      });
    },
  });

  const cafeItemStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: scale.value,
        },
      ],
    };
  }, [scale.value]);

  return (
    <TapGestureHandler
      onGestureEvent={panGestureHandler}
      shouldCancelWhenOutside={true}>
      <Animated.View style={[styles.cafeItem, cafeItemStyle]} ref={cafeItemRef}>
        <View style={styles.cafeItem__container}>
          <View style={styles.cafeItem__imageBox}>
            <Image
              style={styles.cafeItem__image}
              source={{
                uri: cafeItem.image,
              }}
            />
          </View>
          <View style={styles.cafeItem__imageShadow} />
          <BottomBar />
          <Text style={styles.cafeItem_discountText}>-20%</Text>
        </View>
      </Animated.View>
    </TapGestureHandler>
  );
}

const styles = StyleSheet.create({
  cafeItem: {
    width: windowWidth - 30,
    height: 200,
    marginTop: 25,
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 15,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },

  cafeItem__container: {
    overflow: 'hidden',
    borderRadius: 15,
  },

  cafeItem__imageBox: {
    width: '100%',
    height: 120,
  },

  cafeItem__image: {
    width: '100%',
    height: '100%',
  },

  cafeItem__imageShadow: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.1)',
    width: '100%',
    height: '100%',
  },

  cafeItem_discountText: {
    position: 'absolute',
    backgroundColor: 'orange',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    right: -3,
    top: 30,
    padding: 5,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CafeItem);
