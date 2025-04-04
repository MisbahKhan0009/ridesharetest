import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = "https://ride.emplique.com";

interface CreateRidePayload {
  vehicle_type: string;
  pickup_name: string;
  destination_name: string;
  pickup_latitude?: number;
  pickup_longitude?: number;
  destination_latitude?: number;
  destination_longitude?: number;
  departure_time: string;
  seats_available: number;
  is_female_only: boolean;
}

interface RideResponse {
  id: number;
  ride_code: string;
  host: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  vehicle_type: string;
  pickup_name: string;
  destination_name: string;
  pickup_latitude?: number;
  pickup_longitude?: number;
  destination_latitude?: number;
  destination_longitude?: number;
  departure_time: string;
  seats_available: number;
  is_completed: boolean;
  is_female_only: boolean;
}

class RideService {
  private async getHeaders() {
    const token = await AsyncStorage.getItem('access_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  // 1. Create Ride
  async createRide(payload: CreateRidePayload): Promise<RideResponse> {
    const headers = await this.getHeaders();
    const response = await fetch(`${BASE_URL}/api/rides/create/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create ride');
    }
    return data;
  }

  // 2. Join Ride by ID
  async joinRide(rideId: number): Promise<{ message: string; ride: RideResponse }> {
    const headers = await this.getHeaders();
    const response = await fetch(`${BASE_URL}/api/rides/join/${rideId}/`, {
      method: 'POST',
      headers,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to join ride');
    }
    return data;
  }

  // 3. Join Ride by Code
  async joinRideByCode(rideCode: string): Promise<{ message: string; ride: RideResponse }> {
    const headers = await this.getHeaders();
    const response = await fetch(`${BASE_URL}/api/rides/join-by-code/`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ ride_code: rideCode }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to join ride');
    }
    return data;
  }

  // 4. List Available Rides
  async listRides(): Promise<RideResponse[]> {
    const headers = await this.getHeaders();
    const response = await fetch(`${BASE_URL}/api/rides/list/`, {
      headers,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch rides');
    }
    return data;
  }

  // 5. Get Ride Details
  async getRideDetails(rideId: number): Promise<RideResponse> {
    const headers = await this.getHeaders();
    const response = await fetch(`${BASE_URL}/api/rides/${rideId}/`, {
      headers,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch ride details');
    }
    return data;
  }

  // 6. Leave Ride
  async leaveRide(rideId: number): Promise<{ message: string }> {
    const headers = await this.getHeaders();
    const response = await fetch(`${BASE_URL}/api/rides/leave/${rideId}/`, {
      method: 'POST',
      headers,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to leave ride');
    }
    return data;
  }

  // 7. Complete Ride
  async completeRide(rideId: number): Promise<{ message: string; ride: RideResponse }> {
    const headers = await this.getHeaders();
    const response = await fetch(`${BASE_URL}/api/rides/${rideId}/complete/`, {
      method: 'POST',
      headers,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to complete ride');
    }
    return data;
  }

  // 8. Current Rides
  async getCurrentRides(): Promise<{ hosted_rides: RideResponse[]; member_rides: RideResponse[] }> {
    const headers = await this.getHeaders();
    const response = await fetch(`${BASE_URL}/api/rides/current/`, {
      headers,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch current rides');
    }
    return data;
  }

  // 9. Ride History
  async getRideHistory(): Promise<{ hosted_rides: RideResponse[]; member_rides: RideResponse[] }> {
    const headers = await this.getHeaders();
    const response = await fetch(`${BASE_URL}/api/rides/history/`, {
      headers,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch ride history');
    }
    return data;
  }

  // 10. Get Unreviewed Users
  async getUnreviewedUsers(rideId: number): Promise<Array<{
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  }>> {
    const headers = await this.getHeaders();
    const response = await fetch(`${BASE_URL}/api/rides/${rideId}/unreviewed-users/`, {
      headers,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch unreviewed users');
    }
    return data;
  }

  // 11. Delete Ride
  async deleteRide(rideId: number): Promise<{ message: string }> {
    const headers = await this.getHeaders();
    const response = await fetch(`${BASE_URL}/api/rides/delete/${rideId}/`, {
      method: 'DELETE',
      headers,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete ride');
    }
    return data;
  }
}

export const rideService = new RideService();