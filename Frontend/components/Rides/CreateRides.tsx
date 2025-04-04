import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import {
  MapPin,
  Car as CarIcon,
  Truck,
  Bike,
  CalendarClock,
} from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { FadeInDown } from "react-native-reanimated";
import Colors from "../../constants/Colors";
import { useToast } from "../ToastProvider";
import { router } from "expo-router";
import { rideService } from '../../services/rideService';

const BASE_URL = "https://ride.emplique.com";

const vehicleTypes = {
  CNG: { icon: Truck, seats: 3 },
  Uber: { icon: CarIcon, seats: 3 },
  Taxi: { icon: CarIcon, seats: 3 },
  "Private Car": { icon: CarIcon, seats: 3 },
  "Private Bike": { icon: Bike, seats: 1 },
  Rickshaw: { icon: Bike, seats: 2 },
};

export default function CreateRide() {
  const [pickupName, setPickupName] = useState("");
  const [destinationName, setDestinationName] = useState("");
  const [departureTime, setDepartureTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState("date");
  const [vehicleType, setVehicleType] = useState("");
  const [totalFare, setTotalFare] = useState("");
  const [isFemaleOnly, setIsFemaleOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMaleUser, setIsMaleUser] = useState<boolean | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        if (!token) return;

        const response = await fetch(`${BASE_URL}/api/users/profile/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setIsMaleUser(userData.gender?.toLowerCase() === "male");
          if (userData.gender?.toLowerCase() === "male") {
            setIsFemaleOnly(false);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleCreateRide = async () => {
    if (!pickupName || !destinationName || !departureTime || !vehicleType || !totalFare) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        vehicle_type: vehicleType,
        pickup_name: pickupName,
        destination_name: destinationName,
        departure_time: departureTime.toISOString(),
        seats_available: vehicleTypes[vehicleType].seats,
        is_female_only: isFemaleOnly,
        total_fare: totalFare,
      };

      const response = await rideService.createRide(payload);
      
      if (response.message) {
        showToast(response.message, "success");
      } else {
        showToast("Ride created successfully!", "success");
      }
      
      // Reset form
      setPickupName("");
      setDestinationName("");
      setDepartureTime(new Date());
      setVehicleType("");
      setIsFemaleOnly(false);
      setTotalFare("");
      router.push("/(tabs)/rides");
    } catch (error) {
      if (error.response?.data?.error) {
        showToast(error.response.data.error, "error");
      } else if (error.message) {
        showToast(error.message, "error");
      } else {
        showToast("Failed to create ride. Please try again.", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const showDateTimePicker = (mode) => {
    setPickerMode(mode);
    setShowPicker(true);
  };

  const onDateTimeChange = (event, selectedValue) => {
    const currentDate = selectedValue || departureTime;
    if (Platform.OS === "android") {
      setShowPicker(false);
      if (pickerMode === "date") {
        // After date selection, show time picker
        setDepartureTime(currentDate);
        setTimeout(() => showDateTimePicker("time"), 100);
      } else {
        setDepartureTime(currentDate);
      }
    } else {
      // iOS keeps picker open until confirmed
      setDepartureTime(currentDate);
    }
  };

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <Animated.View
        style={styles.formContainer}
        entering={FadeInDown.delay(300).duration(500)}
      >
        <View style={styles.inputGroup}>
          <View style={styles.inputContainer}>
            <MapPin
              size={20}
              color={Colors.light.subtext}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Pickup Location"
              value={pickupName}
              onChangeText={setPickupName}
              placeholderTextColor={Colors.light.subtext}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.inputContainer}>
            <MapPin
              size={20}
              color={Colors.light.subtext}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Destination"
              value={destinationName}
              onChangeText={setDestinationName}
              placeholderTextColor={Colors.light.subtext}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => showDateTimePicker("date")}
          >
            <CalendarClock
              size={20}
              color={Colors.light.subtext}
              style={styles.inputIcon}
            />
            <Text style={styles.dateTimeText}>
              {departureTime.toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </Text>
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              value={departureTime}
              mode={pickerMode}
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={onDateTimeChange}
              minimumDate={new Date()}
              minuteInterval={5}
            />
          )}
        </View>

        <View style={styles.vehicleTypeContainer}>
          {Object.entries(vehicleTypes).map(
            ([type, { icon: Icon, seats }], index) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.vehicleButton,
                  vehicleType === type && styles.selectedVehicleButton,
                  { marginRight: index % 3 !== 2 ? 10 : 0 },
                ]}
                onPress={() => setVehicleType(type)}
              >
                <Icon
                  size={24}
                  color={
                    vehicleType === type
                      ? Colors.light.primary
                      : Colors.light.text
                  }
                />
                <Text
                  style={[
                    styles.vehicleText,
                    vehicleType === type && styles.selectedVehicleText,
                  ]}
                >
                  {type}
                </Text>
                <Text style={styles.seatsText}>{seats} seats</Text>
              </TouchableOpacity>
            )
          )}
        </View>

        {isMaleUser === false && (
          <View style={styles.genderContainer}>
            <Text style={styles.genderLabel}>Female Only Ride?</Text>
            <View style={styles.switchContainer}>
              <TouchableOpacity
                style={[
                  styles.switchButton,
                  !isFemaleOnly && styles.switchButtonActive,
                ]}
                onPress={() => setIsFemaleOnly(false)}
              >
                <Text
                  style={[
                    styles.switchText,
                    !isFemaleOnly && styles.switchTextActive,
                  ]}
                >
                  No
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.switchButton,
                  isFemaleOnly && styles.switchButtonActive,
                ]}
                onPress={() => setIsFemaleOnly(true)}
              >
                <Text
                  style={[
                    styles.switchText,
                    isFemaleOnly && styles.switchTextActive,
                  ]}
                >
                  Yes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.inputGroup}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Total Fare (BDT)"
              value={totalFare}
              onChangeText={setTotalFare}
              keyboardType="numeric"
              placeholderTextColor={Colors.light.subtext}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.createButton, isLoading && styles.disabledButton]}
            onPress={handleCreateRide}
            disabled={isLoading}
          >
            <Text style={styles.createButtonText}>
              {isLoading ? "Creating..." : "Create Ride"}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 0,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: "Inter-Regular",
  },
  dateTimeText: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: "Inter-Regular",
  },
  vehicleTypeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  vehicleButton: {
    width: "30%",
    backgroundColor: Colors.light.card,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: 10,
  },
  selectedVehicleButton: {
    borderColor: Colors.light.primary,
    backgroundColor: "#F0EFFE",
  },
  vehicleText: {
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: "Inter-Medium",
    marginTop: 4,
    textAlign: "center",
  },
  selectedVehicleText: {
    color: Colors.light.primary,
  },
  seatsText: {
    fontSize: 12,
    color: Colors.light.subtext,
    fontFamily: "Inter-Regular",
    marginTop: 2,
  },
  genderContainer: {
    marginBottom: 16,
  },
  genderLabel: {
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: "Inter-SemiBold",
    marginBottom: 8,
  },
  switchContainer: {
    flexDirection: "row",
    backgroundColor: Colors.light.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  switchButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  switchButtonActive: {
    backgroundColor: Colors.light.primary,
  },
  switchText: {
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: "Inter-Medium",
  },
  switchTextActive: {
    color: "#FFFFFF",
  },
  buttonContainer: {
    marginTop: 16,
  },
  createButton: {
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: Colors.light.border,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Inter-SemiBold",
  },
  bottomPadding: {
    height: 80,
  },
});
