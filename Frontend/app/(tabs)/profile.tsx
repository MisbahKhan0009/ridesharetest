import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { User, Star, Car, CreditCard, Bell, Settings, CircleHelp as HelpCircle, LogOut, ChevronRight } from "lucide-react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    phone: "",
    rating: 0,
    rides: 0,
    image: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541",
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("user_data");
        if (userData) {
          const user = JSON.parse(userData);
          setUserProfile({
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            phone: user.phone_number || "Not provided",
            rating: user.rating || 0,
            rides: user.total_rides || 0,
            image: user.profile_photo || userProfile.image, // fallback to default if no photo
          });
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    loadUserData();
  }, []);

  const menuItems = [
    {
      id: "1",
      title: "My Vehicles",
      icon: <Car size={22} color="#6C63FF" />,
      screen: "/vehicles",
    },
    {
      id: "2",
      title: "Payment Methods",
      icon: <CreditCard size={22} color="#6C63FF" />,
      screen: "/payment",
    },
    {
      id: "3",
      title: "Notifications",
      icon: <Bell size={22} color="#6C63FF" />,
      screen: "/notifications",
    },
    {
      id: "4",
      title: "Settings",
      icon: <Settings size={22} color="#6C63FF" />,
      screen: "/settings",
    },
    {
      id: "5",
      title: "Help & Support",
      icon: <HelpCircle size={22} color="#6C63FF" />,
      screen: "/help",
    },
  ];

  const { user, logout } = useAuth();
  
  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
          } catch (error) {
            console.error("Error during logout:", error);
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: userProfile.image }} style={styles.profileImage} />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{userProfile.name}</Text>
          <Text style={styles.email}>{userProfile.email}</Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => router.push("/edit-profile")}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.profileSection}>
        <Image source={{ uri: userProfile.image }} style={styles.profileImage} />
        <Text style={styles.profileName}>{userProfile.name}</Text>
        <Text style={styles.profileEmail}>{userProfile.email}</Text>
        <Text style={styles.profilePhone}>{userProfile.phone}</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Star size={18} color="#FFD700" />
            </View>
            <Text style={styles.statValue}>{userProfile.rating}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Car size={18} color="#6C63FF" />
            </View>
            <Text style={styles.statValue}>{userProfile.rides}</Text>
            <Text style={styles.statLabel}>Rides</Text>
          </View>
        </View>
      </View>

      <View style={styles.menuSection}>
        {menuItems.map((item) => (
          <TouchableOpacity key={item.id} style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              {item.icon}
              <Text style={styles.menuItemTitle}>{item.title}</Text>
            </View>
            <ChevronRight size={20} color="#8E8E93" />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}  // Add this line if it's missing
      >
        <LogOut size={22} color="#FF3B30" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333333",
  },
  editButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    color: "#8E8E93",
    marginBottom: 5,
  },
  profilePhone: {
    fontSize: 16,
    color: "#8E8E93",
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },
  statItem: {
    alignItems: "center",
    paddingHorizontal: 30,
  },
  statIconContainer: {
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 14,
    color: "#8E8E93",
  },
  statDivider: {
    width: 1,
    height: "100%",
    backgroundColor: "#EEEEEE",
  },
  menuSection: {
    backgroundColor: "#FFFFFF",
    marginTop: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#EEEEEE",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemTitle: {
    fontSize: 16,
    color: "#333333",
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    marginTop: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#EEEEEE",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FF3B30",
    marginLeft: 10,
  },
  versionContainer: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 30,
  },
  versionText: {
    fontSize: 14,
    color: "#8E8E93",
  },
});
