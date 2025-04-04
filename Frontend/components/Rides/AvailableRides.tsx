import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Colors from '../../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToast } from '../ToastProvider';
import RideCard from './RideCard';
import { router } from 'expo-router';
import { rideService } from '../../services/rideService';

const BASE_URL = 'https://ride.emplique.com';

async function refreshToken() {
  try {
    const refreshToken = await AsyncStorage.getItem('refresh_token');
    if (!refreshToken) return null;

    const response = await fetch(`${BASE_URL}/api/users/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      await AsyncStorage.setItem('access_token', data.access);
      return data.access;
    }
    return null;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}

async function fetchRidesWithAuth(setRides, setIsLoading, setCurrentUserId, showToast) {
  setIsLoading(true);
  try {
    let token = await AsyncStorage.getItem('access_token');
    
    if (!token) {
      showToast('Please login first', 'error');
      router.push('/auth/login');
      return;
    }

    // Fetch current user ID
    let profileResponse = await fetch(`${BASE_URL}/api/users/profile/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (profileResponse.status === 401) {
      token = await refreshToken();
      if (!token) {
        showToast('Session expired. Please login again.', 'error');
        await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user_data']);
        router.push('/auth/login');
        return;
      }
      profileResponse = await fetch(`${BASE_URL}/api/users/profile/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    }

    if (profileResponse.ok) {
      const profileData = await profileResponse.json();
      setCurrentUserId(profileData.id);
    }

    let response = await fetch(`${BASE_URL}/api/rides/list/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 401) {
      token = await refreshToken();
      if (!token) {
        showToast('Session expired. Please login again.', 'error');
        await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user_data']);
        router.push('/auth/login');
        return;
      }

      response = await fetch(`${BASE_URL}/api/rides/list/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    }

    if (response.ok) {
      const data = await response.json();
      setRides(data);
    } else {
      showToast('Failed to fetch rides', 'error');
    }
  } catch (error) {
    showToast('Network error. Please try again.', 'error');
    console.error('Error fetching rides:', error);
  } finally {
    setIsLoading(false);
  }
}

export default function AvailableRides() {
  const [rides, setRides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    setIsLoading(true);
    try {
      const data = await rideService.listRides();
      setRides(data);
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinRide = async (rideId: number) => {
    try {
      const { message } = await rideService.joinRide(rideId);
      showToast(message, "success");
      fetchRides(); // Refresh the list
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const renderAvailableRideItem = ({ item }) => (
    <Animated.View entering={FadeInDown.delay(100).duration(400)}>
      <RideCard
        id={item.id}
        host={item.host}
        vehicle_type={item.vehicle_type}
        pickup_name={item.pickup_name}
        destination_name={item.destination_name}
        departure_time={item.departure_time}
        total_fare={item.total_fare}
        seats_available={item.seats_available}
        members={item.members}
        currentUserId={currentUserId}
      />
    </Animated.View>
  );

  return (
    <FlatList
      data={rides}
      renderItem={renderAvailableRideItem}
      keyExtractor={item => item.id.toString()}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={() => (
        <View style={styles.listHeader}>
          <View style={styles.searchFiltersContainer}>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterButtonText}>Filters</Text>
              <ChevronDown size={16} color={Colors.light.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.sortButton}>
              <Text style={styles.sortButtonText}>Sort by: Nearest</Text>
              <ChevronDown size={16} color={Colors.light.text} />
            </TouchableOpacity>
          </View>
          <Text style={styles.resultsText}>
            {isLoading ? 'Loading...' : `${rides.length} rides found`}
          </Text>
        </View>
      )}
      ListFooterComponent={() => <View style={styles.bottomPadding} />}
      ListEmptyComponent={() => (
        <Text style={styles.emptyText}>
          {isLoading ? 'Loading rides...' : 'No available rides found'}
        </Text>
      )}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  listHeader: {
    marginBottom: 16,
  },
  searchFiltersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0EFFE',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  filterButtonText: {
    color: Colors.light.primary,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginRight: 4,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  sortButtonText: {
    color: Colors.light.text,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginRight: 4,
  },
  resultsText: {
    fontSize: 14,
    color: Colors.light.subtext,
    fontFamily: 'Inter-Regular',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.light.subtext,
    textAlign: 'center',
    padding: 20,
    fontFamily: 'Inter-Regular',
  },
  bottomPadding: {
    height: 80,
  },
});