import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MapPin, Clock, Users, Car, CheckCircle2 } from 'lucide-react-native';
import { useLocalSearchParams } from 'expo-router';
import { rideService } from '../../services/rideService';
import { useToast } from '../ToastProvider';
import Colors from '../../constants/Colors';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Trash2, Star } from 'lucide-react-native';

export default function RideDetails() {
  const { id } = useLocalSearchParams();
  const [ride, setRide] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();
  const [unreviewedUsers, setUnreviewedUsers] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleCompleteRide = async () => {
    try {
      const { message } = await rideService.completeRide(Number(id));
      showToast(message, "success");
      fetchRideDetails();
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const fetchUnreviewedUsers = async () => {
    try {
      const users = await rideService.getUnreviewedUsers(Number(id));
      setUnreviewedUsers(users);
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const handleDeleteRide = async () => {
    try {
      setIsDeleting(true);
      const { message } = await rideService.deleteRide(Number(id));
      showToast(message, "success");
      router.back();
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setIsDeleting(false);
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
        <View style={styles.header}>
          <View style={styles.hostInfo}>
            <Image 
              source={{ 
                uri: ride.host.profile_photo || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'
              }} 
              style={styles.hostImage} 
            />
            <View>
              <Text style={styles.hostName}>
                {`${ride.host.first_name} ${ride.host.last_name}`}
              </Text>
              <Text style={styles.hostLabel}>Host</Text>
            </View>
          </View>
          <Text style={styles.rideCode}>Code: {ride.ride_code}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.routeContainer}>
            <View style={styles.routePoint}>
              <MapPin size={20} color={Colors.light.primary} />
              <Text style={styles.locationText}>{ride.pickup_name}</Text>
            </View>
            <View style={styles.routeDivider} />
            <View style={styles.routePoint}>
              <MapPin size={20} color={Colors.light.error} />
              <Text style={styles.locationText}>{ride.destination_name}</Text>
            </View>
          </View>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Clock size={20} color={Colors.light.subtext} />
              <Text style={styles.detailText}>{`${timeString}, ${dateString}`}</Text>
            </View>
            <View style={styles.detailItem}>
              <Car size={20} color={Colors.light.subtext} />
              <Text style={styles.detailText}>{ride.vehicle_type}</Text>
            </View>
            <View style={styles.detailItem}>
              <Users size={20} color={Colors.light.subtext} />
              <Text style={styles.detailText}>{`${ride.seats_available} seats available`}</Text>
            </View>
            {ride.is_female_only && (
              <View style={styles.detailItem}>
                <Text style={[styles.detailText, styles.femaleOnly]}>Female Only</Text>
              </View>
            )}
          </View>
        </View>

        {!ride.is_completed && ride.host.id === currentUserId && (
          <TouchableOpacity 
            style={styles.completeButton}
            onPress={handleCompleteRide}
          >
            <CheckCircle2 size={20} color="#FFFFFF" />
            <Text style={styles.completeButtonText}>Complete Ride</Text>
          </TouchableOpacity>
        )}

        {ride?.host.id === currentUserId && !ride.is_completed && (
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={handleDeleteRide}
            disabled={isDeleting}
          >
            <Trash2 size={20} color="#FFFFFF" />
            <Text style={styles.deleteButtonText}>
              {isDeleting ? "Deleting..." : "Delete Ride"}
            </Text>
          </TouchableOpacity>
        )}

        {ride?.is_completed && unreviewedUsers.length > 0 && (
          <View style={styles.unreviewedSection}>
            <Text style={styles.unreviewedTitle}>Pending Reviews</Text>
            {unreviewedUsers.map((user) => (
              <View key={user.id} style={styles.unreviewedUser}>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>
                    {user.first_name} {user.last_name}
                  </Text>
                  <Text style={styles.userEmail}>{user.email}</Text>
                </View>
                <Star size={20} color={Colors.light.primary} />
              </View>
            ))}
          </View>
        )}
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    padding: 16,
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
    fontFamily: 'Inter-Regular',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  hostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hostImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  hostName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    fontFamily: 'Inter-SemiBold',
  },
  hostLabel: {
    fontSize: 14,
    color: Colors.light.subtext,
    fontFamily: 'Inter-Regular',
  },
  rideCode: {
    fontSize: 14,
    color: Colors.light.primary,
    fontFamily: 'Inter-Medium',
  },
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  routeContainer: {
    marginBottom: 20,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  routeDivider: {
    height: 20,
    width: 2,
    backgroundColor: Colors.light.border,
    marginLeft: 10,
  },
  locationText: {
    fontSize: 16,
    marginLeft: 12,
    color: Colors.light.text,
    fontFamily: 'Inter-Regular',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingTop: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    marginLeft: 8,
    color: Colors.light.text,
    fontFamily: 'Inter-Regular',
  },
  femaleOnly: {
    color: Colors.light.primary,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  completeButton: {
    backgroundColor: Colors.light.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  deleteButton: {
    backgroundColor: Colors.light.error,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  unreviewedSection: {
    marginTop: 24,
    padding: 16,
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  unreviewedTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: Colors.light.text,
    fontFamily: 'Inter-SemiBold',
  },
  unreviewedUser: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: 'Inter-Medium',
  },
  userEmail: {
    fontSize: 14,
    color: Colors.light.subtext,
    fontFamily: 'Inter-Regular',
  },
});