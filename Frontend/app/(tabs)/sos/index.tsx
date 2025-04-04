import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { TriangleAlert as AlertTriangle } from "lucide-react-native";
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, Easing } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Update imports at the top
import Colors from "../../../constants/Colors";
import { useToast } from "../../../components/ToastProvider";
import * as Location from "expo-location";

const BASE_URL = "https://ride.emplique.com";

// Add these interfaces after the imports and before the component
interface Contact {
  id: number;
  contact: {
    id: number;
    first_name: string;
    last_name: string;
    phone_number: string;
  };
}

interface EmergencyContact {
  id: number;
  contactId: number;
  name: string;
  phone: string;
}

interface LocationCoords {
  latitude: number;
  longitude: number;
}

interface LocationData {
  coords: LocationCoords;
}

// Update the state declarations in the component
export default function SOSScreen() {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [location, setLocation] = useState<LocationData | null>(null);
  const { showToast } = useToast();

  const scale = useSharedValue(1);
  const borderWidth = useSharedValue(2);

  const sosButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderWidth: borderWidth.value,
  }));

  useEffect(() => {
    scale.value = withRepeat(withSequence(withTiming(1.05, { duration: 1000, easing: Easing.inOut(Easing.ease) }), withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })), -1, true);

    borderWidth.value = withRepeat(withSequence(withTiming(6, { duration: 1000, easing: Easing.inOut(Easing.ease) }), withTiming(2, { duration: 1000, easing: Easing.inOut(Easing.ease) })), -1, true);

    fetchEmergencyContacts();
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS !== "web") {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          showToast("Location permission denied", "error");
          return;
        }
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
      }
    } catch (error) {
      showToast("Error getting location", "error");
      console.error("Location error:", error);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isEmergencyActive && countdown > 0) {
      interval = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    } else if (countdown === 0) {
      triggerEmergencyAlert();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isEmergencyActive, countdown]);

  const fetchEmergencyContacts = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        showToast("Please log in to fetch emergency contacts", "error");
        return;
      }

      const response = await fetch(`${BASE_URL}/api/sos/emergency-contacts/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Fetched emergency contacts:", data);

      if (response.ok) {
        const formattedContacts = data.map((contact: Contact) => ({
          id: contact.id,
          contactId: contact.contact.id,
          name: `${contact.contact.first_name} ${contact.contact.last_name}`,
          phone: contact.contact.phone_number || "N/A",
        }));
        setEmergencyContacts(formattedContacts);
        if (formattedContacts.length === 0) {
          showToast("No emergency contacts found", "info");
        }
      } else {
        showToast("Failed to fetch emergency contacts: " + (data.detail || "Unknown error"), "error");
      }
    } catch (error) {
      showToast("Network error fetching emergency contacts", "error");
      console.error("Error:", error);
    }
  };

  const triggerEmergencyAlert = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        showToast("Please log in to send SOS", "error");
        router.replace("/auth/login");
        return;
      }

      if (emergencyContacts.length === 0) {
        showToast("No emergency contacts available to notify", "error");
        setIsEmergencyActive(false);
        setCountdown(5);
        return;
      }

      const defaultLatitude = 23.797911; // Gulshan, Dhaka latitude
      const defaultLongitude = 90.414391; // Gulshan, Dhaka longitude

      const payload = {
        latitude: location ? location.coords.latitude : defaultLatitude,
        longitude: location ? location.coords.longitude : defaultLongitude,
        // Send SOS only to emergency contacts by default
      };

      if (!location) {
        showToast("Location unavailable. Using default coordinates.", "info");
      }

      const response = await fetch(`${BASE_URL}/api/sos/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("SOS create response:", data);

      if (response.ok) {
        showToast(data.notification_status || "SOS sent to emergency contacts successfully", "success");
      } else {
        showToast(data.error || "Failed to send SOS", "error");
      }
    } catch (error) {
      showToast("Network error sending SOS", "error");
      console.error("Error:", error);
    } finally {
      setIsEmergencyActive(false);
      setCountdown(5);
    }
  };

 

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>What happens when you press SOS?</Text>
          <Text style={styles.infoText}>
            1. Your emergency contacts will be notified{"\n"}
            2. Your current location will be shared{"\n"}
            3. Nearby emergency services will be alerted{"\n"}
            4. A loud alarm will sound (if enabled)
          </Text>
        </View>

        {emergencyContacts.length > 0 && (
          <View style={styles.contactsSection}>
            <Text style={styles.contactsTitle}>Emergency Contacts</Text>
            {emergencyContacts.map((contact) => (
              <View key={contact.id} style={styles.contactItem}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactPhone}>{contact.phone}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  sosButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  sosButtonOuter: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  sosButtonOuterActive: {
    borderColor: "#EF4444",
    borderWidth: 6,
  },
  sosButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  sosButtonActive: {
    backgroundColor: "#FF0000",
  },
  sosButtonText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 5,
    fontFamily: "Inter-Bold",
  },
  countdownText: {
    color: "#FFFFFF",
    fontSize: 40,
    fontWeight: "700",
    fontFamily: "Inter-Bold",
  },
  sosInstructions: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    fontFamily: "Inter-Regular",
  },
  infoSection: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
    fontFamily: "Inter-SemiBold",
  },
  infoText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 24,
    fontFamily: "Inter-Regular",
  },
  contactsSection: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  contactsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
    fontFamily: "Inter-SemiBold",
  },
  contactItem: {
    marginBottom: 10,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
    fontFamily: "Inter-Medium",
  },
  contactPhone: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: "Inter-Regular",
  },
});
