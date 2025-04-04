import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  useWindowDimensions,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { 
  FadeIn, 
  FadeInDown, 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming,
  Easing
} from 'react-native-reanimated';
import Colors from '../../constants/Colors';
import Logo from '../../components/Logo';
import AnimatedPressable from '../../components/AnimatedPressable';
import { ScrollView } from 'react-native';  // Add ScrollView to imports

export default function WelcomeScreen() {
  const { width } = useWindowDimensions();
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  React.useEffect(() => {
    // Subtle floating animation
    translateY.value = withRepeat(
      withTiming(-10, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    
    // Subtle pulse animation
    scale.value = withRepeat(
      withTiming(1.05, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedImageStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
        { scale: scale.value }
      ]
    };
  });

  const handleGetStarted = () => {
    router.replace('/auth/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.content}>
          <Animated.View 
            style={styles.logoContainer}
            entering={FadeInDown.delay(100).duration(800)}
          >
            <Logo size="large" animated={true} />
          </Animated.View>
          
          <Animated.View 
            style={[styles.imageContainer, { width: width * 0.9 }]}
            entering={FadeInDown.delay(300).duration(800)}
          >
            <Animated.Image 
              source={{ uri: 'assets/images/welcome.svg' }} 
              style={[styles.image, animatedImageStyle]}
              resizeMode="contain"
            />
          </Animated.View>
          
          <Animated.View 
            style={styles.contentContainer}
            entering={FadeInDown.delay(500).duration(800)}
          >
            <Text style={styles.title}>RideShare</Text>
            <Text style={styles.subtitle}>Your Journey, Shared</Text>
            
            <Text style={styles.description}>
              Connect with drivers and passengers going your way. Save money, reduce traffic, and make new friends along the way.
            </Text>
            
            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <View style={styles.featureDot} />
                <Text style={styles.featureText}>Find affordable rides</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureDot} />
                <Text style={styles.featureText}>Offer rides & earn money</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureDot} />
                <Text style={styles.featureText}>Verified community members</Text>
              </View>
            </View>
          </Animated.View>
        </View>
        
        <Animated.View 
          style={styles.buttonContainer}
          entering={FadeIn.delay(800).duration(1000)}
        >
          <TouchableOpacity 
            style={styles.button}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Update styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  imageContainer: {
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    width: '85%',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.light.primary,
    marginBottom: 8,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: 20,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: Colors.light.subtext,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    fontFamily: 'Inter-Regular',
  },
  featuresContainer: {
    width: '100%',
    alignItems: 'flex-start',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.primary,
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: 'Inter-Medium',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 30,
    marginTop: 30, // Add margin top instead of position fixed
  },
  button: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderRadius: 12,
    marginBottom: 16, // Increased margin for better spacing
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
});