import * as React from 'react';
import {View, Animated, StyleSheet } from "react-native";
import * as store from '../../store';

const LoadingBar = ({loading}) => {
  const barWidth = store.windowWidth*60/100
  const animation = React.useRef(new Animated.Value(0)).current;
  const inputRange = [0, 1];
  const outputRange = [barWidth*-1, barWidth+store.windowWidth] //should be barwidthx-1 to screenwidth+barwidth
  const animatedWidth = animation.interpolate({inputRange, outputRange});
  const styles= {
    height: '100%',
    transform:[{translateX: animatedWidth}],
    width: barWidth,
  };

  Animated.loop(
    Animated.timing(animation, {
      toValue : 1,
      duration : 1500,
      useNativeDriver: false,
    })
  ).start();

  if(!loading){
    Animated.timing(
      animation
    ).stop();
  }

  return (
    <View className='absolute w-full bg-primary h-1 z-30'>
      <Animated.View style={[styles]}>
        <View className="bg-accent h-full"></View>
      </Animated.View>
    </View>
  )
}

export default LoadingBar