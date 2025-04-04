import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { rideService } from '../../services/rideService';
import { useToast } from '../../components/ToastProvider';
import Colors from '../../constants/Colors';
import { MapPin, Clock, Users, Car, Star } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function RideDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [ride, setRide] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchRideDetails();
  }, [id]);

  const fetchRideDetails = async () => {
    try {
      setIsLoading(true);
      const data = await rideService.getRideDetails(Number(id));
      setRide(data);
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

  if (!ride) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Ride not found</Text>
      </View>
    );
  }

  const departureDate = new Date(ride.departure_time);
  const timeString = departureDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateString = departureDate.toLocaleDateString();

  return (
    <ScrollView style={styles.container}>
      <Animated.View entering={FadeIn.duration(500)} style={styles.content}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Ride Details</Text>
            <Text style={styles.price}>৳{ride.total_fare}</Text>
          </View>

          <View style={styles.hostInfo}>
            <Text style={styles.hostLabel}>Host</Text>
            <Text style={styles.hostName}>{ride.host.first_name} {ride.host.last_name}</Text>
          </View>

          <View style={styles.routeContainer}>
            <View style={styles.routePoint}>
              <MapPin size={24} color={Colors.light.primary} />
              <View style={styles.routeTextContainer}>
                <Text style={styles.routeLabel}>Pickup</Text>
                <Text style={styles.routeText}>{ride.pickup_name}</Text>
              </View>
            </View>

            <View style={styles.routeDivider} />

            <View style={styles.routePoint}>
              <MapPin size={24} color={Colors.light.error} />
              <View style={styles.routeTextContainer}>
                <Text style={styles.routeLabel}>Destination</Text>
                <Text style={styles.routeText}>{ride.destination_name}</Text>
              </View>
            </View>
          </View>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Clock size={20} color={Colors.light.primary} />
              <Text style={styles.detailLabel}>Departure</Text>
              <Text style={styles.detailText}>{timeString}</Text>
              <Text style={styles.detailSubtext}>{dateString}</Text>
            </View>

            <View style={styles.detailItem}>
              <Car size={20} color={Colors.light.primary} />
              <Text style={styles.detailLabel}>Vehicle</Text>
              <Text style={styles.detailText}>{ride.vehicle_type}</Text>
            </View>

            <View style={styles.detailItem}>
              <Users size={20} color={Colors.light.primary} />
              <Text style={styles.detailLabel}>Seats</Text>
              <Text style={styles.detailText}>{ride.seats_available} available</Text>
            </View>
          </View>

          {ride.members.length > 0 && (
            <View style={styles.membersSection}>
              <Text style={styles.membersTitle}>Members</Text>
              {ride.members.map((member, index) => (
                <Text key={index} style={styles.memberName}>
                  {member.first_name} {member.last_name}
                </Text>
              ))}
            </View>
          )}
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: Colors.light.error,
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
    fontFamily: 'Inter-SemiBold',
  },
  price: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.primary,
    fontFamily: 'Inter-SemiBold',
  },
  hostInfo: {
    marginBottom: 24,
  },
  hostLabel: {
    fontSize: 14,
    color: Colors.light.subtext,
    marginBottom: 4,
    fontFamily: 'Inter-Regular',
  },
  hostName: {
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: 'Inter-Medium',
  },
  routeContainer: {
    marginBottom: 24,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  routeTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  routeLabel: {
    fontSize: 14,
    color: Colors.light.subtext,
    marginBottom: 4,
    fontFamily: 'Inter-Regular',
  },
  routeText: {
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: 'Inter-Medium',
  },
  routeDivider: {
    height: 24,
    width: 2,
    backgroundColor: Colors.light.border,
    marginLeft: 11,
    marginVertical: 8,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.light.subtext,
    marginTop: 8,
    marginBottom: 4,
    fontFamily: 'Inter-Regular',
  },
  detailText: {
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: 'Inter-Medium',
  },
  detailSubtext: {
    fontSize: 14,
    color: Colors.light.subtext,
    marginTop: 2,
    fontFamily: 'Inter-Regular',
  },
  membersSection: {
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingTop: 16,
  },
  membersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 12,
    fontFamily: 'Inter-SemiBold',
  },
  memberName: {
    fontSize: 15,
    color: Colors.light.text,
    marginBottom: 8,
    fontFamily: 'Inter-Regular',
  },
});