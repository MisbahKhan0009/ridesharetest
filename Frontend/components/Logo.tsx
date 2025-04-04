import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Car } from 'lucide-react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming, 
  withDelay,
  Easing
} from 'react-native-reanimated';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
}

const Logo = ({ size = 'medium', animated = true }: LogoProps) => {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  
  React.useEffect(() => {
    if (animated) {
      // Subtle rotation animation
      rotation.value = withRepeat(
        withTiming(5, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
      
      // Subtle pulse animation
      scale.value = withRepeat(
        withDelay(
          500,
          withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    }
  }, [animated]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotation.value}deg` },
        { scale: scale.value }
      ]
    };
  });

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return 18;
      case 'large':
        return 28;
      default:
        return 22;
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 16;
      case 'large':
        return 24;
      default:
        return 20;
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.iconContainer, animatedStyle]}>
        <Car size={getIconSize()} color="#2A3990" />
      </Animated.View>
      <Text style={[styles.logoText, { fontSize: getFontSize() }]}>
        <Text style={styles.boldText}>Ride</Text>
        <Text style={styles.normalText}>Share</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  logoText: {
    fontWeight: '700',
  },
  boldText: {
    color: '#2A3990',
    fontWeight: '700',
  },
  normalText: {
    color: '#4E4FEB',
    fontWeight: '500',
  }
});

export default Logo;