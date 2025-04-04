import React from 'react';
import { Pressable, PressableProps } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';

interface AnimatedPressableProps extends PressableProps {
  children: React.ReactNode;
  scaleAmount?: number;
}

const AnimatedPressable = ({ 
  children, 
  scaleAmount = 0.97,
  style,
  ...props 
}: AnimatedPressableProps) => {
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      pressed.value,
      [0, 1],
      [1, scaleAmount],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }]
    };
  });

  return (
    <Pressable
      onPressIn={() => {
        pressed.value = withTiming(1, { duration: 150 });
      }}
      onPressOut={() => {
        pressed.value = withTiming(0, { duration: 150 });
      }}
      {...props}
    >
      <Animated.View style={[animatedStyle, style]}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

export default AnimatedPressable;