import { router, Tabs } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { Bell, User, AlertTriangle } from "lucide-react-native";
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, Easing } from "react-native-reanimated";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToast } from "../../../components/ToastProvider";
import * as Location from "expo-location";

// Add interfaces
interface EmergencyContact {
  id: number;
  contactId: number;
  name: string;
  phone: string;
}

interface LocationData {
  coords: {
    latitude: number;
    longitude: number;
  };
}

// Add this interface with the other interfaces
interface Contact {
  id: number;
  contact: {
    id: number;
    first_name: string;
    last_name: string;
    phone_number: string;
  };
}

const BASE_URL = "https://ride.emplique.com";

export default function SOSLayout() {
  // Add states
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

  // Add this useEffect after other useEffects
  useEffect(() => {
    fetchEmergencyContacts();
    requestLocationPermission();
  }, []);

  useEffect(() => {
    scale.value = withRepeat(withSequence(withTiming(1.05, { duration: 1000, easing: Easing.inOut(Easing.ease) }), withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })), -1, true);

    borderWidth.value = withRepeat(withSequence(withTiming(6, { duration: 1000, easing: Easing.inOut(Easing.ease) }), withTiming(2, { duration: 1000, easing: Easing.inOut(Easing.ease) })), -1, true);
  }, []);

 
 
 

  // Add these functions after the existing useEffect
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

      const defaultLatitude = 23.797911;
      const defaultLongitude = 90.414391;

      const payload = {
        latitude: location ? location.coords.latitude : defaultLatitude,
        longitude: location ? location.coords.longitude : defaultLongitude,
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

  const handleSOSPress = () => {
    if (!isEmergencyActive) {
      if (emergencyContacts.length === 0) {
        showToast("Please add emergency contacts in Settings first", "error");
        return;
      }
      setIsEmergencyActive(true);
      showToast(
        `SOS will be sent to ${emergencyContacts.length} contact${
          emergencyContacts.length !== 1 ? "s" : ""
        } in ${countdown} seconds. Tap again to cancel.`,
        "info"
      );
    } else {
      setIsEmergencyActive(false);
      setCountdown(5);
      showToast("Emergency alert cancelled", "info");
    }
  };

  // Add countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isEmergencyActive && countdown > 0) {
      interval = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    } else if (isEmergencyActive && countdown === 0) {
      triggerEmergencyAlert();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isEmergencyActive, countdown]);

  const handleProfilePress = () => {
    router.push("/profile");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SOS</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.headerIcon}>
            <Bell size={20} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={handleProfilePress}
          >
            <User size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* SOS Button */}
      <View style={styles.sosButtonContainer}>
          <Animated.View
            style={[
              styles.sosButtonOuter,
              sosButtonAnimatedStyle,
              isEmergencyActive && styles.sosButtonOuterActive,
            ]}
          >
            <TouchableOpacity
              style={[
                styles.sosButton,
                isEmergencyActive && styles.sosButtonActive,
              ]}
              onPress={handleSOSPress}
              activeOpacity={0.8}
            >
              {isEmergencyActive ? (
                <Text style={styles.countdownText}>{countdown}</Text>
              ) : (
                <>
                  <AlertTriangle size={40} color="#FFFFFF" />
                  <Text style={styles.sosButtonText}>SOS</Text>
                </>
              )}
            </TouchableOpacity>
          </Animated.View>

          <Text style={styles.sosInstructions}>
            {isEmergencyActive
              ? 'Tap again to cancel'
              : 'Tap to trigger SOS to emergency contacts'}
          </Text>
        </View>

      {/* Tabs */}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#FFFFFF", // White background to match the screenshot
            borderBottomWidth: 1,
            borderBottomColor: "#E5E7EB", // Light gray border
            elevation: 0,
            shadowOpacity: 0,
            height: 50,
            paddingTop: 5,
            paddingBottom: 5,
          },
          tabBarActiveTintColor: "#3B82F6", // Blue color for active tab
          tabBarInactiveTintColor: "#6B7280", // Gray color for inactive tabs
          tabBarLabelStyle: {
            fontSize: 14,
            fontFamily: "Inter-Medium",
            paddingBottom: 8,
          },
          tabBarPosition: "top",
        }}
        tabBar={({ state, descriptors, navigation }) => (
          <View style={styles.tabsContainer}>
            {state.routes.map((route, index) => {
              const { options } = descriptors[route.key];
              const label = options.tabBarLabel || options.title || route.name;
              const isFocused = state.index === index;

              const onPress = () => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              };

              return (
                <TouchableOpacity key={route.key} style={[styles.tabButton, isFocused && styles.activeTabButton]} onPress={onPress}>
                  <Text style={[styles.tabText, isFocused && styles.activeTabText]}>{typeof label === "string" ? label : null}</Text>
                  {isFocused && <View style={styles.activeTabIndicator} />}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "SOS",
            tabBarLabel: "SOS",
          }}
        />
        <Tabs.Screen
          name="quick-search"
          options={{
            title: "Quick Search",
            tabBarLabel: "Quick Search",
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "SOS Settings",
            tabBarLabel: "Settings",
          }}
        />
      </Tabs>
    </View>
  );
}

// Update styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF", // White background to match the screenshot
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB", // Light gray border
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937", // Dark gray for text
    fontFamily: "Inter-SemiBold",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    marginRight: 16,
  },
  profileButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF", // White background to match the screenshot
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB", // Light gray border
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    position: "relative",
  },
  activeTabButton: {
    backgroundColor: "#FFFFFF",
  },
  tabText: {
    fontSize: 14,
    color: "#6B7280", // Gray color for inactive tabs
    fontFamily: "Inter-Medium",
  },
  activeTabText: {
    color: "#3B82F6", // Blue color for active tab
    fontFamily: "Inter-SemiBold",
  },
  activeTabIndicator: {
    position: "absolute",
    bottom: 0,
    left: "25%",
    right: "25%",
    height: 3,
    backgroundColor: "#3B82F6", // Blue underline for active tab
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  sosButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  sosButtonOuter: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
  },
  sosButton: {
    width: "100%",
    height: "100%",
    borderRadius: 75,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
  },
  sosButtonText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 8,
  },
  sosButtonOuterActive: {
    borderColor: "#EF4444",
    borderWidth: 6,
  },
  sosButtonActive: {
    backgroundColor: "#FF0000",
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
});
