import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ticket } from 'lucide-react-native';
import { rideService } from '../../services/rideService';
import { useToast } from '../ToastProvider';
import Colors from '../../constants/Colors';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function JoinByCode() {
  const [rideCode, setRideCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const handleJoinRide = async () => {
    if (!rideCode.trim()) {
      showToast('Please enter a ride code', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const { message, ride } = await rideService.joinRideByCode(rideCode.trim());
      showToast(message, 'success');
      router.push(`/ride/${ride.id}`);
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View 
        entering={FadeInDown.duration(500)}
        style={styles.content}
      >
        <View style={styles.iconContainer}>
          <Ticket size={40} color={Colors.light.primary} />
        </View>
        
        <Text style={styles.title}>Join a Ride</Text>
        <Text style={styles.subtitle}>Enter the ride code to join</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter ride code"
            value={rideCode}
            onChangeText={setRideCode}
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={6}
            placeholderTextColor={Colors.light.subtext}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.joinButton,
            (!rideCode.trim() || isLoading) && styles.joinButtonDisabled
          ]}
          onPress={handleJoinRide}
          disabled={!rideCode.trim() || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.joinButtonText}>Join Ride</Text>
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 100,
  },
  iconContainer: {
    backgroundColor: Colors.light.card,
    padding: 20,
    borderRadius: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
    fontFamily: 'Inter-SemiBold',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.subtext,
    marginBottom: 32,
    fontFamily: 'Inter-Regular',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 24,
  },
  input: {
    backgroundColor: Colors.light.card,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: Colors.light.text,
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
  },
  joinButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  joinButtonDisabled: {
    opacity: 0.6,
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
});