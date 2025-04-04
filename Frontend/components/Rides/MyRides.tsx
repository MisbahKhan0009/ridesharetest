import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { rideService } from "../../services/rideService";
import { useToast } from "../ToastProvider";
import Colors from "../../constants/Colors";
import RideCard from "./RideCard";
import Animated, { FadeInDown } from "react-native-reanimated";

interface Ride {
  id: number;
  host: {
    id: number;
    first_name: string;
    last_name: string;
    profile_photo?: string;
  };
  vehicle_type: string;
  pickup_name: string;
  destination_name: string;
  departure_time: string;
  total_fare: string;
  seats_available: number;
  members: Array<{ id: number }>;
  is_completed: boolean;
}

interface RidesState {
  hosted_rides: Ride[];
  member_rides: Ride[];
}

export default function MyRides() {
  const [currentRides, setCurrentRides] = useState<RidesState>({
    hosted_rides: [],
    member_rides: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchCurrentRides();
  }, []);

  const fetchCurrentRides = async () => {
    try {
      setIsLoading(true);
      const data = await rideService.getCurrentRides();
      setCurrentRides({
        hosted_rides: data?.hosted_rides ?? [],
        member_rides: data?.member_rides ?? [],
      });
    } catch (error) {
      showToast(error.message, "error");
      setCurrentRides({ hosted_rides: [], member_rides: [] });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteRide = async (rideId: number) => {
    try {
      const { message } = await rideService.completeRide(rideId);
      showToast(message, "success");
      fetchCurrentRides(); // Refresh the list
    } catch (error) {
      showToast(error.message, "error");
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
      {currentRides.hosted_rides.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rides You're Hosting</Text>
          {currentRides.hosted_rides.map((ride, index) => (
            <Animated.View key={ride.id} entering={FadeInDown.delay(index * 100).duration(400)}>
              <RideCard {...ride} currentUserId={ride.host.id} onComplete={() => handleCompleteRide(ride.id)} />
            </Animated.View>
          ))}
        </View>
      )}

      {currentRides.member_rides.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rides You've Joined</Text>
          {currentRides.member_rides.map((ride, index) => (
            <Animated.View key={ride.id} entering={FadeInDown.delay(index * 100).duration(400)}>
              <RideCard {...ride} currentUserId={ride.host.id} />
            </Animated.View>
          ))}
        </View>
      )}

      {currentRides.hosted_rides.length === 0 && currentRides.member_rides.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>You have no active rides</Text>
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
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: Colors.light.text,
    fontFamily: "Inter-SemiBold",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.light.subtext,
    fontFamily: "Inter-Regular",
  },
});
