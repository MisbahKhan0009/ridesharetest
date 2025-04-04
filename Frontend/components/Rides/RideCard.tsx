import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { MapPin, Clock, Users, Car } from 'lucide-react-native';
import Colors from '../../constants/Colors';
import { router } from 'expo-router';
import { rideService } from '../../services/rideService';
import { useToast } from '../ToastProvider';
import HostDetailsModal from './HostDetailsModal';

interface Host {
  id: number;
  first_name: string;
  last_name: string;
  profile_photo: string | null;
}

interface Member {
  id: number;
}

interface RideCardProps {
  id: number;
  host: Host;
  vehicle_type: string;
  pickup_name: string;
  destination_name: string;
  departure_time: string;
  total_fare: string;
  seats_available: number;
  members: Member[];
  currentUserId: number | null;
}

export default function RideCard({
  id,
  host,
  vehicle_type,
  pickup_name,
  destination_name,
  departure_time,
  total_fare,
  seats_available,
  members,
  currentUserId,
}: RideCardProps) {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isHostModalVisible, setIsHostModalVisible] = useState(false);

  const handleJoinLeaveRide = async () => {
    setIsLoading(true);
    try {
      if (members.some(member => member.id === currentUserId)) {
        const { message } = await rideService.leaveRide(id);
        showToast(message, "success");
      } else {
        const { message } = await rideService.joinRide(id);
        showToast(message, "success");
      }
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };
  const departureDate = new Date(departure_time);
  const timeString = departureDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateString = departureDate.toLocaleDateString();

  const driverImage = host.profile_photo || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png';
  const driverName = `${host.first_name} ${host.last_name}`;

  const isHost = currentUserId === host.id;
  const isMember = members.some(member => member.id === currentUserId);
  const showViewButton = isHost || isMember;

  const handlePress = () => {
    if (showViewButton) {
      router.push(`/ride/${id}`);
    } else {
      handleJoinLeaveRide();
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.driverInfo}>
          <Image source={{ uri: driverImage }} style={styles.driverImage} />
          <TouchableOpacity onPress={() => setIsHostModalVisible(true)}>
            <Text style={[styles.driverName, styles.clickableText]}>{driverName}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.priceText}>৳{total_fare}</Text>
      </View>

      <View style={styles.routeContainer}>
        <View style={styles.routePoints}>
          <View style={styles.routePointDot} />
          <View style={styles.routeLine} />
          <View style={[styles.routePointDot, styles.routePointDotDestination]} />
        </View>
        <View style={styles.routeDetails}>
          <View style={styles.routePoint}>
            <Text style={styles.routePointText}>{pickup_name}</Text>
          </View>
          <View style={styles.routePoint}>
            <Text style={styles.routePointText}>{destination_name}</Text>
          </View>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Clock size={16} color={Colors.light.subtext} />
          <Text style={styles.detailText}>{timeString}, {dateString}</Text>
        </View>
        <View style={styles.detailItem}>
          <Users size={16} color={Colors.light.subtext} />
          <Text style={styles.detailText}>{seats_available} seats available</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.vehicleInfo}>
          <Car size={16} color={Colors.light.subtext} />
          <Text style={styles.vehicleText}>{vehicle_type}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.detailsButton]}
            onPress={() => router.push(`/ride/${id}`)}
          >
            <Text style={styles.detailsButtonText}>Ride Details</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.actionButton,
              isLoading && styles.actionButtonDisabled
            ]}
            onPress={handleJoinLeaveRide}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.actionButtonText}>
                {isMember ? 'Leave Ride' : 'Join Ride'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <HostDetailsModal
        isVisible={isHostModalVisible}
        onClose={() => setIsHostModalVisible(false)}
        host={host}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    fontFamily: 'Inter-Medium',
  },
  priceText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.primary,
    fontFamily: 'Inter-SemiBold',
  },
  routeContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  routePoints: {
    width: 20,
    alignItems: 'center',
    marginRight: 10,
  },
  routePointDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.light.primary,
  },
  routePointDotDestination: {
    backgroundColor: Colors.light.error,
  },
  routeLine: {
    width: 2,
    height: 30,
    backgroundColor: '#E0E0E0',
    marginVertical: 5,
  },
  routeDetails: {
    flex: 1,
  },
  routePoint: {
    height: 25,
    justifyContent: 'center',
    marginBottom: 5,
  },
  routePointText: {
    fontSize: 15,
    color: Colors.light.text,
    fontFamily: 'Inter-Regular',
  },
  details: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  detailText: {
    fontSize: 14,
    color: Colors.light.subtext,
    marginLeft: 5,
    fontFamily: 'Inter-Regular',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingTop: 15,
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleText: {
    fontSize: 14,
    color: Colors.light.subtext,
    marginLeft: 5,
    fontFamily: 'Inter-Regular',
  },
  actionButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  actionButtonDisabled: {
    opacity: 0.7,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  detailsButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  detailsButtonText: {
    color: Colors.light.text,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  clickableText: {
    textDecorationLine: 'underline',
    color: Colors.light.primary,
  },
});