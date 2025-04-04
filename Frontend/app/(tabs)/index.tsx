import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, Plus, MapPin, Flag, Clock, ChevronRight, Bell } from "lucide-react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { FadeInDown } from "react-native-reanimated";
import Colors from "../../constants/Colors";
import AnimatedPressable from "../../components/AnimatedPressable";
import AvailableRides from "../../components/Rides/AvailableRides";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const [searchText, setSearchText] = useState("");
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541");

  // Load user data from AsyncStorage
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("user_data");
        if (userData) {
          const user = JSON.parse(userData);
          setUserName(user.first_name);
          if (user.profile_photo) {
            setUserImage(user.profile_photo);
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };
    loadUserData();
  }, []);

  // Navigation handlers
  const handleFindRide = () => {
    router.push("/rides"); // Redirect to /rides
  };

  const handleCreateRide = () => {
    router.push("/createride"); // Redirect to /createride
  };

  const handleReportIssue = () => {
    router.push("/(tabs)/report/create-incident"); // Matches your report/create-incident.tsx
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.greeting}>
          <Text style={styles.greetingText}>Hello, {userName}!</Text>
          <Text style={styles.readyText}>Ready to ride?</Text>
        </View>

        <TouchableOpacity style={styles.profileButton} onPress={() => router.push("/(tabs)/profile")}>
          <Image source={{ uri: userImage }} style={styles.profileImage} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View style={styles.searchContainer} entering={FadeInDown.delay(300).duration(500)}>
          <View style={styles.searchBar}>
            <Search size={20} color={Colors.light.subtext} style={styles.searchIcon} />
            <TextInput 
              style={styles.searchInput} 
              placeholder="Search rides by destination name..." 
              value={searchText} 
              onChangeText={setSearchText} 
              placeholderTextColor={Colors.light.subtext} 
            />
          </View>
        </Animated.View>

        <Animated.View 
          style={[styles.quickActionsContainer, { flexDirection: 'row', justifyContent: 'space-between' }]} 
          entering={FadeInDown.delay(400).duration(500)}
        >
          <AnimatedPressable 
            style={[styles.quickActionButton, { width: (width - 40) / 3 }]}
            onPress={handleFindRide}
          >
            <View style={styles.quickActionIconContainer}>
              <Search size={24} color={Colors.light.primary} />
            </View>
            <Text style={styles.quickActionText}>Find a Ride</Text>
          </AnimatedPressable>

          <AnimatedPressable 
            style={[styles.quickActionButton, { width: (width - 40) / 3 }]}
            onPress={handleCreateRide}
          >
            <View style={styles.quickActionIconContainer}>
              <Plus size={24} color={Colors.light.primary} />
            </View>
            <Text style={styles.quickActionText}>Create a Ride</Text>
          </AnimatedPressable>

          <AnimatedPressable 
            style={[styles.quickActionButton, { width: (width - 40) / 3 }]}
            onPress={handleReportIssue}
          >
            <View style={styles.quickActionIconContainer}>
              <Flag size={24} color={Colors.light.primary} />
            </View>
            <Text style={styles.quickActionText}>Report Issue</Text>
          </AnimatedPressable>
        </Animated.View>

        <Animated.View style={styles.sectionContainer} entering={FadeInDown.delay(500).duration(500)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Rides</Text>
          </View>
          <AvailableRides />
        </Animated.View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.light.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  greeting: {
    flex: 1,
  },
  greetingText: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.light.text,
    fontFamily: "Inter-SemiBold",
  },
  readyText: {
    fontSize: 14,
    color: Colors.light.subtext,
    fontFamily: "Inter-Regular",
    marginTop: 2,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  scrollView: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: "Inter-Regular",
  },
  quickActionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  quickActionButton: {
    width: (width - 40) / 2,
    backgroundColor: Colors.light.card,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
    height: 90,
  },
  quickActionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#F0EFFE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: "Inter-Medium",
    textAlign: "center",
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text,
    fontFamily: "Inter-SemiBold",
  },
  bottomPadding: {
    height: 20,
  },
});