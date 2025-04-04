import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Bell, User } from "lucide-react-native";
import Colors from "../../constants/Colors";
import CreateRide from "../../components/Rides/CreateRides";
import AvailableRides from "../../components/Rides/AvailableRides";
import MyRides from "../../components/Rides/MyRides";

export default function RidesScreen() {
  const [activeTab, setActiveTab] = useState("available");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rides</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.headerIcon}>
            <Bell size={20} color={Colors.light.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButton}>
            <User size={20} color={Colors.light.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "create" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("create")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "create" && styles.activeTabText,
            ]}
          >
            Create Ride
          </Text>
          {activeTab === "create" && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "available" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("available")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "available" && styles.activeTabText,
            ]}
          >
            Available Rides
          </Text>
          {activeTab === "available" && (
            <View style={styles.activeTabIndicator} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "my" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("my")}
        >
          <Text
            style={[styles.tabText, activeTab === "my" && styles.activeTabText]}
          >
            My Rides
          </Text>
          {activeTab === "my" && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        {activeTab === "create" && <CreateRide />}
        {activeTab === "available" && <AvailableRides />}
        {activeTab === "my" && <MyRides />}
      </View>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.light.text,
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
    backgroundColor: Colors.light.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    position: "relative",
  },
  activeTabButton: {
    backgroundColor: Colors.light.card,
  },
  tabText: {
    fontSize: 14,
    color: Colors.light.subtext,
    fontFamily: "Inter-Medium",
  },
  activeTabText: {
    color: Colors.light.primary,
    fontFamily: "Inter-SemiBold",
  },
  activeTabIndicator: {
    position: "absolute",
    bottom: 0,
    left: "25%",
    right: "25%",
    height: 3,
    backgroundColor: Colors.light.primary,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  contentContainer: {
    flex: 1,
  },
});
