import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { rideService } from '../../services/rideService';
import { useToast } from '../ToastProvider';
import Colors from '../../constants/Colors';
import RideCard from './RideCard';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function RideHistory() {
  const [completedRides, setCompletedRides] = useState({ hosted_rides: [], member_rides: [] });
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchRideHistory();
  }, []);

  const fetchRideHistory = async () => {
    try {
      setIsLoading(true);
      const data = await rideService.getRideHistory();
      setCompletedRides(data);
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {completedRides.hosted_rides.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rides You've Hosted</Text>
          {completedRides.hosted_rides.map((ride, index) => (
            <Animated.View 
              key={ride.id} 
              entering={FadeInDown.delay(index * 100).duration(400)}
            >
              <RideCard
                {...ride}
                currentUserId={ride.host.id}
                isCompleted={true}
              />
            </Animated.View>
          ))}
        </View>
      )}

      {completedRides.member_rides.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rides You've Joined</Text>
          {completedRides.member_rides.map((ride, index) => (
            <Animated.View 
              key={ride.id} 
              entering={FadeInDown.delay(index * 100).duration(400)}
            >
              <RideCard
                {...ride}
                currentUserId={ride.host.id}
                isCompleted={true}
              />
            </Animated.View>
          ))}
        </View>
      )}

      {completedRides.hosted_rides.length === 0 && completedRides.member_rides.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No ride history available</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: Colors.light.text,
    fontFamily: 'Inter-SemiBold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.light.subtext,
    fontFamily: 'Inter-Regular',
  },
});